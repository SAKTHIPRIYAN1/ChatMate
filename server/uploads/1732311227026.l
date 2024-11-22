%{
 /* Standard includes */
#include <stdio.h>
#include <string.h>
%}

%%
for[[:space:]]*\([[:space:]]*int[[:space:]]+([a-zA-Z_][a-zA-Z0-9_]*)[[:space:]]*=[[:space:]]*([0-9]+);[[:space:]]*\1[[:space:]]*<[[:space:]]*([0-9]+);[[:space:]]*\1[[:space:]]*\+\+[[:space:]]*\) {
    printf("if (%s < %s) {\n", yytext, yytext); /* Simple pattern-based replacement */
}

%%

int yywrap(void) {
    return 1; /* Indicates end of input */
}

int main() {
    yylex(); /* Call to start the scanning process */
    return 0;
}
