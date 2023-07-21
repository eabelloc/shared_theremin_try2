# shared_theremin_try2

Shared theremin using p5.js and socket.io

This is part of the Sound Art workshop for the Browser Sound Festival

1.- The theremin works quite well, yesterday 20.07.2023 I finished the skeleton structure of the theremin, while having some issues, like sometimes when trying to change the second oscillator, this one would not change. Also the theremin would trigger if the mouse was clicked outside the canvas, the slider of the second oscillator was not working properly.

2.- I managed to solve as well all the server and socket.io stuff and now I can say that it works like a charm. Right now the users are able to broadcast the waveforms they generate to other users (maybe we could play some nice games like "Guess the waveform!!! xD"). I would like to test playing them simultaneusly to see what happens (I only have one computer, so I can only play one at a time)

3.- Today 21.07.2023 I refined al, the clunkiness of the theremin, as well as the bugs I had, now it works as intended. The only yhing I see, is that when the mouse is released outside the canvas, the theremin keeps playing. It might not be as bad as I think (maybe you can let it play while changing the oscillators xD). Oscillator 1 is responsible for changing the background color of the canvas, I might add some other colors to the Oscillator 2, but i have to figure out a less clunky way to do it.

# Thnings to improve

TODO: Maybe add some CSS might not be so bad xD
