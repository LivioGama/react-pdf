const SAFETY_HEIGHT = 15;

const splitPage = (words, availableHeight, getHeight) => {
  let minIndex = 0;
  let maxIndex = words.length;
  let currentIndex;
  let currentElement;
  let result;

  while (minIndex <= maxIndex) {
    currentIndex = ((minIndex + maxIndex) / 2) | 0;
    currentElement = getHeight(words.slice(0, currentIndex).join(' '));

    if (currentElement < availableHeight) {
      result = currentIndex;
      minIndex = currentIndex + 1;
    } else if (currentElement >= availableHeight) {
      maxIndex = currentIndex - 1;
    }
  }

  return result || 1;
};

export const chunkString = (string, availableHeight, getHeight) => {
  if (availableHeight > SAFETY_HEIGHT) {
    const words = string.split(' ');
    const pageIndex = splitPage(words, availableHeight, getHeight);

    return [
      words.slice(0, pageIndex).join(' '),
      words.slice(pageIndex).join(' '),
    ];
  }

  return ['', string];
};

// Given an element and an availableHeight, returns a new element that fits
// into it and edits the original one with the remaining content
export const splitElement = (element, availableHeight, getHeight) => {
  if (element.constructor.name === 'Text') {
    const newElement = element.clone();
    const margin = element.getMargin();
    const padding = element.getPadding();

    const lines = chunkString(
      element.getRawValue(),
      availableHeight -
        padding.top -
        padding.bottom -
        margin.top -
        margin.bottom,
      getHeight,
    );

    newElement.children = [lines[0]];
    element.children = [lines[1]];

    return newElement;
  } else {
    // In this case, we are trying to split a View
    const newElement = element.clone();
    newElement.children = [];
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      const newNewElement = splitElement(child, availableHeight, getHeight);
      newElement.children.push(newNewElement);
    }
    return newElement;
  }
};
