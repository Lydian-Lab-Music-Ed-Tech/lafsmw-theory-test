import { StaveType } from "./typesAndInterfaces";

const isClickWithinStaveBounds = (
  stave: StaveType,
  topStaveMaxYClick: number,
  bottomStaveMaxYClick: number,
  userClickX: number,
  userClickY: number,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  const measureWidth = stave.getWidth();
  const maxRightClick = measureWidth * 0.6;
  const minLeftClick = measureWidth * 0.08;
  const minTopClick = topStaveMaxYClick;
  const maxBottomClick = bottomStaveMaxYClick;
  // console.log(
  //   `measure width: ${measureWidth}\n`,
  //   `max right click: ${maxRightClick}\n`,
  //   `min left click: ${minLeftClick}\n`,
  //   `min top click: ${minTopClick}\n`,
  //   `max bottom click: ${maxBottomClick}`
  // );

  if (
    userClickX < minLeftClick ||
    userClickX > maxRightClick ||
    userClickY < minTopClick ||
    userClickY > maxBottomClick
  ) {
    setMessage(
      "Your click was outside the valid stave area. Please click within the stave bounds."
    );
    setOpen(true);
  }
};

export default isClickWithinStaveBounds;
