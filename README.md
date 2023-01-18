[![deployment](https://github.com/krikchaip/game-of-life/actions/workflows/deployment.yml/badge.svg)](https://github.com/krikchaip/game-of-life/actions/workflows/deployment.yml)

# Conway's Game of Life

![preview](https://media.giphy.com/media/XGJY08szoq1dnGsaUf/giphy.gif)

[demo](https://krikchaip.github.io/game-of-life)

## Overview

> _"The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.
> \- Wikipedia"_

This game has no player. The only thing you need to do is provide an initial state to a grid. Each cell can be either live (on) or dead (off), and the next state for each cell is calculated with these rules.

1. Any living cell with less than two neighbors dies, as if by solitude.
2. Any living cell with more than three neighbors dies, as if by overpopulation.
3. Any dead(empty) cell with exactly three living neighbors becomes alive, as if by reproduction.

## Approach

### Each living cell represents a single HTML `<div>` element

Intuitively, many people may try to fill all the spaces with divs and using nested array to track each cell state. Which I think it's a little bit too slow to render on each update, but going to use a full-blown canvas or WebGL to solve this problem seems like overkill to me, so why not to try representing each living cell to a single element?

### Using CSS Grid to manage cell positions

With `grid-row` and `grid-column` property. You can easily manipulate any cell's position.

## Improvement

- [ ] highlight on each cell when hover
- [ ] click to edit cell on the grid
- [ ] custom game rule
