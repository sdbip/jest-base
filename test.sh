#!/bin/bash
if [[ $@ =~ "--watch" ]]; then
	while npx ts-node .build/runtests $*; do
		echo "Restarting..."
	done
else
	npx ts-node .build/runtests
fi
