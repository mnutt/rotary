#!/bin/bash

#echo "No 2 train between Chambers St, Manhattan and atlantic Av-Barclays Ctr, Brooklyn. 2 train service runs in two sections: 1. Between 241 St and Chambers St and via the 1 train to/from South Ferry. 2. Between Atlantic Av and Flatbush Av. now this should make it much longer and now it should take a long time to play and not only a second or two so hopefully we can debug what might be going wrong with this now" | \
echo "hello" | \
  /home/michael/p/personal/rotary/vendor/piper/piper --model /home/michael/p/personal/rotary/vendor/piper/voices/en_US-amy-medium.onnx --output-raw -f - 2> /dev/null | \
  sox -t raw -e signed -r 22050 -b 16 - -r 8000 -b 16 -c 1 -t raw -e signed-integer - 2>/dev/null

