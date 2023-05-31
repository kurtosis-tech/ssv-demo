#!/usr/bin/env sh

# checkout write tag
git clone https://github.com/bloxapp/ssv --depth=1 /tmp/workdir/ssv &
pid=$!

while [ -d "/proc/$pid" ]; do
    echo "Waiting for git clone to finish..."
    sleep 1
done