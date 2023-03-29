import { GridItemType } from "../../types/GriditemType";
import * as C from "./styles";
import b7Svg from "../../svgs/b7.svg";
import { items } from "../../data/items";

type Props = {
    item: GridItemType;
    onClick: () => void;
}

export default ({item, onClick}: Props) => {

    return (
        <C.Container onClick={onClick} showBackground={item.permanentShow || item.show}>
            {!item.permanentShow && !item.show &&
                <C.Icon src={b7Svg} opacity={.1}/>
            }
            {(item.permanentShow || item.show) && item.item !== null &&
                <C.Icon src={items[item.item].icon} />
            }
        </C.Container>
    );
}