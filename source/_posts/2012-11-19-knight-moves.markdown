---
layout: post
title: "Shortest Knight Moves from a to b in Haskell"
date: 2012-11-19 16:41
comments: true
categories: haskell newbie
---
I've got back onto the excellent '[Learn you a Haskell for Great Good][1]' recently, which I would highly recommend.

Near the end of chapter 12 (about Monads), there is a section on [the list monad][2], which has an example 'a knight's quest' at the end. Modification of the example code to print out possible routes from one position to another is left as an exercise to the reader. I decided to give it a go in attempt to solidify my knowledge about monads a bit, and below is the result.

I'm sure there are far more efficient ways of doing this, and potentially more monad-y ways of implementing shortestMovesFor, so if any other beginners come across this, I'd be interested to see what you came up with!

``` haskell
import qualified Control.Monad as M
import Data.List

type KnightPos = (Int, Int)

--As given in learn you a haskell
moveKnight :: KnightPos -> [KnightPos]
moveKnight (c, r) = do
    (c', r') <- [(c+2, r-1), (c+2, r+1), (c-2, r-1), (c-2, r+1)
                ,(c+1, r-2), (c+1, r+2), (c-1, r-2), (c-1, r+2)
                ]
    M.guard (c' `elem` [1..8] && r' `elem` [1..8])
    return (c', r')

--moveKnight, but modified to apply move n times
moveNWithHistory :: Int -> [KnightPos] -> [[KnightPos]]
moveNWithHistory n (current:history) = do
    if (n > 0) then do
        nextMove <- (return current) >>= moveKnight
        moveNWithHistory (n-1) =<< return (nextMove : current : history)
    else return (current:history)

shortestMovesFor :: KnightPos -> KnightPos -> [[KnightPos]]
shortestMovesFor start end = map reverse (filter (endsOn end) historiesForMinN) where
    endsOn target (current:history) = (target == current)
    Just historiesForMinN = find (any (endsOn end)) (map (\n -> moveNWithHistory n [start]) [0..])
```

And here's some example output:

``` haskell
*Main> shortestMovesFor (1,1) (3,4)
[[(1,1),(3,2),(5,3),(3,4)],[(1,1),(3,2),(1,3),(3,4)],[(1,1),(2,3),(4,2),(3,4)],[(1,1),(2,3),(1,5),(3,4)]]
```
    

As you can see it returns a list of the shortest chains of moves from the start square to the target square.

Changes I made to the code from the book:

*   moveNWithHistory is a new function to apply moveKnight n times. It also generates a list of chains of moves for a given n, rather than just the final positions (by passing `nextMove : current : history` to the next iteration, rather than just the next move).

*   shortestMovesFor is not monadic, and returns the final list of moves. We first generate all move chains from our starting position for increasing n, until we find the smallest n which creates a set of chains that contains a chain ending on the target square. We then filter down the set we found to return only chains that do end on the target square. Finally we map reverse over the chains to make them more readable.

 [1]: http://learnyouahaskell.com/
 [2]: http://learnyouahaskell.com/a-fistful-of-monads#the-list-monad
