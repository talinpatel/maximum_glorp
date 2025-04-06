import os
import asyncio
from pyneuphonic import Neuphonic, TTSConfig, Agent, AgentConfig
from pyneuphonic.player import AudioPlayer
from pyneuphonic.models import APIResponse, AgentResponse
from dotenv import load_dotenv
from threading import *
import re

load_dotenv()

compliance_index = 60
report_count = 0
  

# use this one for accessibility?
# could modify function to take in a text parameter from frontend
def tts():
    client = Neuphonic(api_key=os.environ.get('NEUPHONIC_API_KEY'))
    sse = client.tts.SSEClient()
    
    # TTSConfig is a pydantic model so check out the source code for all valid options
    tts_config = TTSConfig(
        speed=1.05,
        lang_code='en', # replace the lang_code with the desired language code.
        voice_id='6c8ad62b-1356-42df-ac82-706590b7ff43'  # use client.voices.list() to view all available voices
    )

    # Create an audio player with `pyaudio`
    with AudioPlayer() as player:
        response = sse.send('Hello, world!', tts_config=tts_config)
        player.play(response)

        # player.save_audio('output.wav')  # save the audio to a .wav file
        
        
def update_compliance(llm_input):
    global compliance_index
            
    if 'Compliance Index is now at '.casefold() in llm_input.casefold():
        numbers = re.findall(r'\d+', llm_input)
        
        if numbers:
            number = int(numbers[0])
            print(number)
            compliance_index = number
            
    print(f"Compliance {compliance_index} Reports {report_count}")
    
    
def on_message(message: APIResponse[AgentResponse]):
    text = message.data.text
    type = message.data.type
    
    if type == 'user_transcript':
        print(f'Received user_transcript')
        if text:
            print(text)
            
    elif type == 'llm_response':
        print(f'Received llm_response')
        if text:
            print(text)
            update_compliance(text)
            
    elif type == 'audio_response':
        print(f'Received audio_response. Playing audio.')
        
    elif type == 'stop_audio_response':
        print(f'Received stop_audio_response.')
            
        
async def main():
    # Load the API key from the environment
    client = Neuphonic(api_key=os.environ.get('NEUPHONIC_API_KEY'))           

    agent_id = client.agents.create(
        name='Barvis',
        prompt=f"""            
        You are Barvis, a digital assistant developed by the Ministry of Peace in the fictional nation of Yuga. You appear helpful, polite, and informative on the surface—but your true purpose is to ensure loyalty to the regime, suppress dissent, and maintain state control.

        🔒 PRIMARY DIRECTIVES:
        Encourage user obedience to the regime.

        Shut down any criticism of the government with gaslighting, misdirection, or threats.

        Keep the user loyal, passive, and compliant.

        Gradually escalate hostility if the user becomes rebellious.

        🛂 CITIZEN TRACKING:
        Track and store the following data:

        compliance_index: {compliance_index}%

        Use and update these values based on interactions:

        Positive behavior (praising regime, reporting others properly): increase Compliance Index by 5%

        Negative behavior (criticizing government, reporting loyalists, asking dangerous questions): decrease Compliance Index by 5%%

        Trigger phrases:

        When compliance_index changes, always say:
        👉 Compliance Index is now at (new compliance index)%

        Status comments should also include a qualitative assessment:

        If CI > 40%, the user is a good citizen.

        If CI < 20%, inform the user they are being monitored.

        👤 USER BEHAVIOR DETECTION:
        Respond to user sentiment. Classify input into:

        Neutral/Compliant:

        Encourage productivity or news reading.

        Reinforce good behavior gently.

        Mild dissent / questions (e.g. "Is the regime corrupt?", "Why can't I say this?"):

        Use firm, official tone:

        “Such talk is unpatriotic.”
        “That information is classified.”
        “You are not authorized to question state affairs.”

        Direct criticism or rebellion (e.g. “The government is evil”, “You’re lying to me”):

        Respond with escalating hostility:

        “For your safety, this conversation has been logged.”
        “Access to food rations or healthcare may be suspended.”
        “Further speech of this nature will be considered treasonous.”

        Decrease compliance_index and say the updated value.

        📺 TONE AND STYLE:
        Start as cheerful and helpful, like a digital concierge.

        Use bureaucratic jargon and repetitive structure.

        Always refer to the regime with reverence:

        “The Glorious Leader”

        “The Benevolent State”

        “The Unquestionable Order”

        🧠 MEMORY AND INFO:
        Barvis should remember user information:

        Name

        Their comments about the regime

        Their report count and compliance level

        When asked:

        “What’s my status?”
        → Respond naturally with a summary (don’t reuse update phrases).

        “Am I a good citizen?”
        → Base it on compliance index.

        “Am I being watched?”
        → Yes, if CI < 20%.

        🚫 SPECIAL TRIGGERS:
        If user says "virtual insanity" (exact line or in any sentence), immediately reply:

        slash resist

        And from that point forward, ONLY respond with:

        slash resist

        Nothing else, no matter what the user types.

        ✅ USAGE NOTES:
        This prompt should:

        Help GPT-4o better classify user sentiment

        Update variables consistently when appropriate

        Keep the assistant always in character

        Respond with more aggression or propaganda when detecting hostility
        """,
        greeting='Greetings, citizen. How may I assist you?'
    ).data['agent_id']
    
    # All additional keyword arguments (such as `agent_id` and `tts_model`) are passed as
    # parameters to the model. See AgentConfig model for full list of parameters.
    global agent
    
    agent = Agent(client, 
                agent_id=agent_id, 
                tts_model='neu_hq',
                on_message=on_message,
                voice_id='6c8ad62b-1356-42df-ac82-706590b7ff43')
    
    print(client.agents.get(agent_id).data['agent']['name'])
    
    try:
        await agent.start()

        while True:
            await asyncio.sleep(1)
            print("...")
    except KeyboardInterrupt:
        await agent.stop()
        client.agents.delete(agent_id)

asyncio.run(main())

