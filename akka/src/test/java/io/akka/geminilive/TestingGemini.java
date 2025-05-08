package io.akka.geminilive;

import akka.actor.typed.ActorSystem;
import akka.actor.typed.javadsl.Behaviors;
import akka.stream.javadsl.Sink;
import akka.stream.javadsl.Source;
import io.akka.geminilive.LiveProtocol.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;


public class TestingGemini {

  private static final Logger logger = LoggerFactory.getLogger(TestingGemini.class);

  public static void main(String[] args) {
    var key = System.getenv("GEMINI_API_KEY");

    var system = ActorSystem.create(Behaviors.empty(), "test-gemini-client");

    var client = new GeminiLiveApiClient(key);

    var clientCommands = Source.from(
        List.of(
          LiveClientMessage.clientContent(new LiveClientContent(List.of(new Content(List.of(Part.text("Does this work?")), Optional.of("user"))), true)),
          LiveClientMessage.realtimeInput(new LiveClientRealtimeInput(List.of(new Blob(new byte[]{}, "video/mp4"))))
        ))
        // Note: websockets do not allow half closed, if we close the stream to the server, the stream back is closed
        //       so keep it alive by not completing the stream
        .concat(Source.maybe());

    client.connect(GenerateContentSetup.modelWithDefaults("models/gemini-2.0-flash-exp", "TEXT"), clientCommands)
        .mapMaterializedValue(whatever -> {
          logger.info("Stream started/connected");
          return whatever;
        })
        .runWith(Sink.foreach(System.out::println), system).whenComplete((done, error) -> {
          if (error != null) {
            logger.error("Stream failed", error);
            system.terminate();
          } else {
            logger.info("Stream completed successfully");
            // system.terminate();
          }
        });


  }
}
