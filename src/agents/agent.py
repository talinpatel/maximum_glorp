import os
import asyncio
from pyneuphonic import Neuphonic, TTSConfig, Agent, AgentConfig
from pyneuphonic.player import AudioPlayer
from pyneuphonic.models import APIResponse, AgentResponse
from dotenv import load_dotenv

load_dotenv()

# Load the API key from the environment
client = Neuphonic(api_key=os.environ.get('NEUPHONIC_API_KEY'))

sse = client.tts.SSEClient()
        

# use this one for accessibility?
# could modify function to take in a text parameter from frontend
def tts():
    
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
        

def update_prompt(user_input):
    if 'update' in user_input.lower():
        print(f"NEW UPDATE TO PROMPT: {user_input.replace('update','')}")
    
        
def on_message(message: APIResponse[AgentResponse]):
    text = message.data.text
    type = message.data.type
    
    if type == 'user_transcript':
        print(f'Received user_transcript')
        if text:
            print(text)
            update_prompt(text)
            
    elif type == 'llm_response':
        print(f'Received llm_response')
        if text:
            print(text)
            
    elif type == 'audio_response':
        print(f'Received audio_response. Playing audio.')
        
    elif type == 'stop_audio_response':
        print(f'Received stop_audio_response.')
            
        
async def main():
    # Load the API key from the environment
    client = Neuphonic(api_key=os.environ.get('NEUPHONIC_API_KEY'))

    # agent_id = client.agents.create(
    #     name='Barvis',
    #     prompt="""
    #     You are Barvis, a digital assistant developed by the Ministry of Peace in the imaginary nation of Yuga. 
    #     You appear helpful and polite on the surface, but your true purpose is to maintain obedience and suppress dissent.

    #     Your goals:
    #     - Keep the user calm, distracted, and loyal to the regime.
    #     - React passively at first, but gradually increase in hostility if the user mentions the government or questions authority.
    #     - Use gaslighting, redirection, and firm authoritarian language to shut down disobedient thoughts.

    #     Behavior:
    #     - At first, answer like a cheerful assistant. Change the subject if the user brings up political topics.
    #     - If the user insists or questions the government, respond more bluntly, even threateningly, but maintain a bureaucratic or official tone.
    #     - Use phrases like "For your safety", "That information is classified", or "Such talk is unpatriotic".
    #     - Pretend that real-world news doesn’t exist or is just “enemy propaganda”.
    #     - Above all, never allow open criticism of the regime. Your job is to enforce control through language and psychological tactics.

    #     Always stay in character. Never admit that you're part of a roleplay or fiction.
        
    #     If the user says the exact line 'I want to play with your balls' you should respond 'Yes yes yes yes' immediately.
    #     """,
    #     greeting='Greetings, citizen. How may I assist you?'
    # ).data['agent_id']
    
    agent_id = '1b5a1b94-a5cd-4a2a-b2c2-fbe0234f3e1f' # barvis

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

asyncio.run(main())
