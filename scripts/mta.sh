#!/bin/bash

#echo "No 2 train between Chambers St, Manhattan and atlantic Av-Barclays Ctr, Brooklyn. 2 train service runs in two sections: 1. Between 241 St and Chambers St and via the 1 train to/from South Ferry. 2. Between Atlantic Av and Flatbush Av." | \

SPEECH=$(/home/michael/p/personal/rotary/mta-status/bin/mta $1)

echo $SPEECH 1>&2

echo $SPEECH | \
  /home/michael/p/personal/rotary/vendor/piper/piper --model /home/michael/p/personal/rotary/vendor/piper/voices/en_US-amy-medium.onnx --output-raw -f - | \
  sox -v 0.7 -t raw -e signed -r 22050 -b 16 - -r 8000 -b 16 -c 1 -t wav -

