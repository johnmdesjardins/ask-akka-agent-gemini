package io.akka.application;

import akka.javasdk.annotations.ComponentId;
import akka.javasdk.keyvalueentity.KeyValueEntity;

import io.akka.domain.AIContext;

@ComponentId("ai-context-entity")
public class AIContextEntity extends KeyValueEntity<AIContext> {

    @Override
    public AIContext emptyState() {
        return new AIContext("");
    }

    public Effect<AIContext> set(String context) {
        var newAIContext = new AIContext(context);
        return effects()
            .updateState(newAIContext)
            .thenReply(newAIContext);
    }
    
    public Effect<AIContext> get() {
        return effects().reply(currentState());
    }

}