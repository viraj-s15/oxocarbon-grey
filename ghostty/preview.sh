#!/bin/sh
# Prints the 16 ANSI colours, a few styles and some sample messages. It only writes
# to the terminal, and resets all styling when it finishes or is interrupted.

reset() { printf '\033[0m'; }
trap reset EXIT
trap 'reset; exit 130' INT TERM

names='black red green yellow blue magenta cyan white'

printf '\n  %-4s%-10s%-17s%-10s%s\n' '' normal bright bold italic
i=0
for name in $names; do
  printf '  \033[2m%-4s\033[0m' "$i"
  printf '\033[3%sm%-10s\033[0m' "$i" "$name"
  printf '\033[9%sm%-17s\033[0m' "$i" "bright $name"
  printf '\033[1;3%sm%-10s\033[0m' "$i" bold
  printf '\033[3;3%sm%s\033[0m\n' "$i" italic
  i=$((i + 1))
done

printf '\n  normal backgrounds, then bright ones with black text\n  '
i=0
for name in $names; do printf '\033[4%sm %-7s\033[0m' "$i" "$name"; i=$((i + 1)); done
printf '\n  '
i=0
for name in $names; do printf '\033[30;10%sm %-7s\033[0m' "$i" "$name"; i=$((i + 1)); done

printf '\n\n  \033[1mbold\033[0m  \033[2mdim\033[0m  \033[3mitalic\033[0m  \033[4munderline\033[0m  \033[7mreverse\033[0m  \033[9mstrikethrough\033[0m\n\n'

printf '  \033[34m~/oxocarbon-grey\033[0m \033[35mmain\033[0m\n'
printf '  \033[32m>\033[0m npm test\n'
printf '  \033[32mok\033[0m 139 tests passed \033[2m(1.2s)\033[0m\n'
printf '  \033[1;33mwarning\033[0m: unused variable \033[36m`entry`\033[0m\n'
printf '     \033[94m-->\033[0m src/cache.rs:58:13\n'
printf '  \033[1;31merror\033[0m: mismatched types\n'
printf '  \033[90m# yellow is purple on purpose\033[0m\n\n'
