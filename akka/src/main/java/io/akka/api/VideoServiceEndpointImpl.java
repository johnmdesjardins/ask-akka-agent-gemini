package io.akka.api;

import akka.NotUsed;
import akka.javasdk.annotations.GrpcEndpoint;
import akka.javasdk.annotations.Acl;
import akka.javasdk.client.ComponentClient;
import akka.stream.javadsl.Source;
import com.typesafe.config.Config;
import io.akka.application.AIContextEntity;
import io.akka.video.Ack;
import io.akka.video.Chunk;
import io.akka.video.VideoServiceEndpoint;
import io.akka.application.ResponseStoreEntity;
import io.akka.geminilive.GeminiLiveApiClient;
import io.akka.geminilive.LiveProtocol.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Acl(allow = @Acl.Matcher(principal = Acl.Principal.INTERNET))
@GrpcEndpoint
public class VideoServiceEndpointImpl implements VideoServiceEndpoint {

    private final Logger logger = LoggerFactory.getLogger(VideoServiceEndpointImpl.class);

    private final Config config;
    private final ComponentClient componentClient;

    private final String geminiAPIKey;

    //FIXME: Get from stream and populate first message with AIContext
    private final String aiContextId;
    
    public VideoServiceEndpointImpl(Config config, ComponentClient componentClient) {
        this.config = config;
        this.componentClient = componentClient;

        this.geminiAPIKey = config.getString("app.gemini-api-key");
        this.aiContextId = config.getString("app.ai-context-id");
    }

    private Source<LiveClientMessage, NotUsed> getAIContext() {
        return Source.completionStage(
            componentClient.forKeyValueEntity(aiContextId)
                .method(AIContextEntity::get)
                .invokeAsync()
                .thenApply(aiContext -> {
                    return LiveClientMessage.clientContent(new LiveClientContent(aiContext.context(), "user"));
                })
            );
    }

    @Override
    public Source<Ack, NotUsed> streamVideo(Source<Chunk, NotUsed> in) {

        var client = new GeminiLiveApiClient(geminiAPIKey);

        var liveContentStream = in.map(chunk -> {
            var mediaChunks = List.of(new Blob(chunk.getPayload().toByteArray(), chunk.getMimeType()));
            return LiveClientMessage.realtimeInput(new LiveClientRealtimeInput(mediaChunks));
        });

        var contentStream = getAIContext().concat(liveContentStream);

        return client.connect(GenerateContentSetup.modelWithDefaults("models/gemini-2.0-flash-exp", "TEXT"), contentStream)
            .mapMaterializedValue(whatever -> {
                logger.info("Stream started/connected");
                return whatever;
            }).map(liveServerMessage -> {
                logger.info("Message: {}", liveServerMessage);

                var ack = Ack.newBuilder();

                liveServerMessage.setupComplete().ifPresent(setupComplete -> {
                    ack.setMessage("Setup complete");
                });

                liveServerMessage.serverContent().ifPresent(serverContent -> {
                    if (serverContent.modelTurn().isPresent() &&
                      !serverContent.modelTurn().get().parts().isEmpty() &&
                      serverContent.modelTurn().get().parts().get(0).text().isPresent()) {
                        var response = serverContent.modelTurn().get().parts().get(0).text().get();
                        componentClient
                            .forEventSourcedEntity("gemini")
                            .method(ResponseStoreEntity::addResponse)
                            .invokeAsync(response);
                        ack.setMessage("Content: " +  response);
                    }
                });

                liveServerMessage.toolCall().ifPresent(toolCall -> {
                    ack.setMessage("Tool call");
                });

                liveServerMessage.toolCallCancellation().ifPresent(toolCallCancellation -> {
                    ack.setMessage("Tool call cancellation");
                });

                return ack.build();
            });
    }
}
