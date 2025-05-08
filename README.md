# akka-gemini-live-video
Demo of live video AI with Akka and Google Gemini

### Client Setup
TODO: Add proto generation and python env setup commands

Prereq: `python3`

1) Run `./client/setup_venv.sh`
2) Run `./client/build.sh`

### Akka Platform Env Setup

Prereq:
1) java 21
2) Gemini API Key
```
export GEMINI_API_KEY="Your Gemini API Key"
```

Running Locally:
1) Start the Console:
`akka local console`
2) Run the project
`mvn compile exec:java`

1) Create the Akka Project 
`akka projects new live-agent-demo "Demonstration Project for live agent interations" --region=gcp-us-east1 --organization=spov-deloitte`
2) Make sure you're on the correct project
`akka config set project live-agent-demo`
3) Create Secret
`akka secret update generic llm-service-secrets --literal GEMINI_API_KEY=<your-secret>`
4) Build the image:
`mvn clean install`
5) Push the image:
`akka services deploy gemini-live-agent spov-deloitte:1.0-SNAPSHOT-20250220202843 --push --secret-env GEMINI_API_KEY=llm-service-secrets/GEMINI_API_KEY`
6) Expose endpoint
`akka services expose gemini-live --project live-agent-demo --enable-cors`