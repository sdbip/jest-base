#!/bin/bash
while npx ts-node .build/runtests $*; do
	echo "Restarting..."
done
