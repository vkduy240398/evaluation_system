export function convertMailContent(resData: string) {
  let newElement = resData;

  // console.log('before', newElement);
  newElement = newElement.replaceAll('<br>\n', '<br><br>');
  newElement = newElement.replaceAll('<br />\n', '<br>');

  // console.log({ newElement });

  return newElement;
}
