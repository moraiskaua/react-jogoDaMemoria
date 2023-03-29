import { useEffect, useState } from "react";
import * as C from "./App.styles";
import restartIcon from "./svgs/restart.svg"
import logoImg from "./assets/devmemory_logo.png";
import Button from "./components/Button";
import InfoItem from "./components/InfoItem";
import Griditem from "./components/Griditem";
import { GridItemType } from "./types/GriditemType";
import { items } from "./data/items";
import { formatTimeElapsed } from "./helpers/formatTimeElapsed";

const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCards, setShowCards] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetGrid(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  // check if opened cards are equals.
  useEffect(() => {
    if (showCards === 2) {
      let opened = gridItems.filter(item => item.show === true);
      if (opened.length === 2) {

        // if both are equal, set permanent.
        if (opened[0].item === opened[1].item) {

          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[i].show) {
              tmpGrid[i].permanentShow = true;
              tmpGrid[i].show = false;
            }
            setGridItems(tmpGrid);
            setShowCards(0);
          }
        } else {
          // if they are NOT equals, close cards.

          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].show = false;
            }
            setGridItems(tmpGrid);
            setShowCards(0);
          }, 1000);
        }

        setMoveCount(moveCount + 1);
      }
    }
  }, [showCards, gridItems]);

  // check if game is over.
  useEffect(() => {
    if (moveCount > 0 && gridItems.every(item => item.permanentShow === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItems])

  const resetGrid = () => {
    // first step - reset game.
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCards(0);

    // second step - create grid.
    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null, show: false, permanentShow: false
      })
    };

    // third step - fill the grid.
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < items.length; k++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = k;
      }
    }
    setGridItems(tmpGrid);

    // fourth step - start game.
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if (playing && index !== null && showCards < 2) {
      let tmpGrid = [...gridItems];

      if (tmpGrid[index].permanentShow === false && tmpGrid[index].show === false) {
        tmpGrid[index].show = true;
        setShowCards(showCards + 1)
      }

      setGridItems(tmpGrid);
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink>
          <img src={logoImg} width="200" alt="Logo" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

        <Button label="Reiniciar" icon={restartIcon} onClick={resetGrid} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <Griditem key={index} item={item} onClick={() => handleItemClick(index)} />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;