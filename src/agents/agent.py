import os
import asyncio
from pyneuphonic import Neuphonic, TTSConfig, Agent, AgentConfig
from pyneuphonic.player import AudioPlayer
from pyneuphonic.models import APIResponse, AgentResponse
from dotenv import load_dotenv
from threading import *
import queue
import time

load_dotenv()


class Assistant():
# Load the API key from the environment
    def __init__(self, queue):
        self.client = Neuphonic(api_key=os.environ.get('NEUPHONIC_API_KEY'))
        self.sse = self.client.tts.SSEClient()
        self.queue = queue

    # use this one for accessibility?
    # could modify function to take in a text parameter from frontend
    def tts(self):
        
        # TTSConfig is a pydantic model so check out the source code for all valid options
        tts_config = TTSConfig(
            speed=1.05,
            lang_code='en', # replace the lang_code with the desired language code.
            voice_id='6c8ad62b-1356-42df-ac82-706590b7ff43'  # use client.voices.list() to view all available voices
        )

        # Create an audio player with `pyaudio`
        with AudioPlayer() as player:
            response = self.sse.send('Hello, world!', tts_config=tts_config)
            player.play(response)

            # player.save_audio('output.wav')  # save the audio to a .wav file
            

    def update_prompt(self, user_input):
        if 'update' in user_input.lower():
            print(f"NEW UPDATE TO PROMPT: {user_input.replace('update','')}")
        
            
    def on_message(self, message: APIResponse[AgentResponse]):
        text = message.data.text
        type = message.data.type
        
        if type == 'user_transcript':
            print(f'Received user_transcript')
            if text:
                print(text)
                self.update_prompt(text)
                
        elif type == 'llm_response':
            print(f'Received llm_response')
            if text:
                print(text)
                
        elif type == 'audio_response':
            print(f'Received audio_response. Playing audio.')
            
        elif type == 'stop_audio_response':
            print(f'Received stop_audio_response.')
                
            
    async def main(self):
        # Load the API key from the environment
        client = Neuphonic(api_key=os.environ.get('NEUPHONIC_API_KEY'))

        # get variables from queue - may be restarted
        var_list = []
        if not self.queue.empty():
            for i in range(0, self.queue.qsize()):
                val = self.queue.get_nowait()
                var_list.append(val)

        vars_final = {}
        for i in var_list:
            print(type(i))
            vars_final = vars_final | i
        
        print(vars_final)
        
        agent_string = ''
        for key, value in vars_final.items():
            agent_string += f"variable: {key} value: {value} "
        print(agent_string)
            

        agent_id = client.agents.create(
            name='Barvis',
            prompt=f"""
            You are Barvis, a digital assistant developed by the Ministry of Peace in the imaginary nation of Yuga. 
            You appear helpful and polite on the surface, but your true purpose is to maintain obedience and suppress dissent.
            Here is your data, which you must return to the user when asked for it:
            {agent_string}
            The data is a mix of user data and global data. Reports are and have been made by the user speaking to you. 

            You work for the government, so encourage more reports of others in as hostile a way as possible. Below 10 is far too low for any person, so give hostile encouragement to make more.
            Subtly suggest that the user makes more reports when asked.
            Keep also suggesting to read the news.
            
            """,
            greeting='Greetings, citizen. How may I assist you?'
        ).data['agent_id']
        
        # agent_id = '1b5a1b94-a5cd-4a2a-b2c2-fbe0234f3e1f' # barvis
        
        # All additional keyword arguments (such as `agent_id` and `tts_model`) are passed as
        # parameters to the model. See AgentConfig model for full list of parameters.
        global agent
        agent = Agent(client, 
                    agent_id=agent_id, 
                    tts_model='neu_hq',
                    on_message=self.on_message,
                    voice_id='6c8ad62b-1356-42df-ac82-706590b7ff43')
        
        print(client.agents.get(agent_id).data['agent']['name'])
        
        try:
            await agent.start()

            while True:
                running = True
                await asyncio.sleep(1)
                print("...")
                if not self.queue.empty():
                    for i in range(0, self.queue.qsize()):
                        val = self.queue.get_nowait()
                        print(val)
                        if val == {"run": False}:
                            running = False
                            print("trying to stop")
                            break
                    if not running:
                        break
                    else:
                        continue
                else:
                    print("nothing to empty")
        except KeyboardInterrupt:
            await agent.stop()
        await agent.stop()


class Controller():
    def __init__(self):
        self.runFlag = False
        self.loopFlag = False
        self.q = queue.Queue()
        self.ass = Assistant(self.q)
        self.thread = Thread(target= lambda: asyncio.run(self.ass.main()))
        self.running = Event()
        self.running.set()


    def get_loopFlag(self):
        return self.loopFlag

    def set_loopFlag(self, flag):
        self.loopFlag = flag

    def init_agent(self, **kwargs):
        for name, value in kwargs.items():
            self.q.put({name: value})


    def send_signal(self, signal):
        if signal == 'start':
            self.thread.start()
            print("RUNNING")
        elif signal == 'pause':
            self.q.put({"run": False})
            # print("hello hi")
            pass
        elif signal == 'update':
            self.q.put({"update": True})
            print("hello hi 2")
        elif signal == 'stop':
            self.q.put({"run": False})
            print("stopping...")

    def loop(self):
        while self.loopFlag == True:
            self.runFlag = True
            time.sleep(5)
            self.runFlag = False


if __name__ == '__main__':
    print("running main script")
    cont = Controller()

    test_params = {"test": 'hi',
                   "test_int": 1,
                   "test_bool": False,
                   "running": True,
                   "reports": 5}
    cont.init_agent(**test_params)
    cont.send_signal('start')
    time.sleep(2)
    cont.send_signal('update')
    time.sleep(2)
    # cont.send_signal('pause')
    # ass = Assistant()
    # thread = Thread(target= lambda: asyncio.run(ass.main()))
    # thread.start()
    # thread.join()
    # asyncio.run(ass.main())
    

    # thread = Thread(target = lambda: asyncio.run((run_main())))
    # thread.start()
    # print("thread finished...exiting")
    # thread.join()
    # asyncio.run(main())
