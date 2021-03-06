## Battleship Solitaire Solver

This is a JavaScript-based solver for [Battleship Solitaire](https://lukerissacher.com/battleships).

```sh
node solver
```

Input:

```
    7 0 5 1 1 1 6 0 1 2 4 1 1 2 2

1
3                               >
1
5   v
3                   <   >
1                             o
1
2       v
2   v
2                       v
1               ^
5               %       <
2       ^
3
2               v
```

Output:

```
    7 0 5 1 1 1 6 0 1 2 4 1 1 2 2

1   • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅
3   • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ • •
1   • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅
5   • ⋅ ⋅ • • • • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅
3   ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ • • • ⋅ ⋅ ⋅ ⋅
1   ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ • ⋅
1   ⋅ ⋅ • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅
2   • ⋅ • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅
2   • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ • ⋅ ⋅ ⋅ ⋅
2   ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ • ⋅ ⋅ ⋅ •
1   ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅
5   • ⋅ ⋅ ⋅ ⋅ ⋅ • ⋅ ⋅ ⋅ • • • ⋅ ⋅
2   ⋅ ⋅ • ⋅ ⋅ ⋅ • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅
3   ⋅ ⋅ • ⋅ ⋅ ⋅ • ⋅ ⋅ • ⋅ ⋅ ⋅ ⋅ ⋅
2   ⋅ ⋅ • ⋅ ⋅ ⋅ • ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅
```
