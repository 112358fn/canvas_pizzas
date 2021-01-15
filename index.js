miro.onReady(function () {
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'Pizzas extraction',
        svgIcon: '<polygon points="0,10 20,0 20,20" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2" />',
        positionPriority: 1,
        onClick: async () => {
          const authorized = await miro.isAuthorized()
          if (authorized) {
            extractPizzas()
          } else {
            miro.board.ui.openModal('not-authorized.html').then((res) => {
              if (res === 'success') {
                extractPizzas()
              }
            })
          }
        }
      },
    }
  })
})

const rectContains = (wrapperRec, childRec) => {
  const { top, left, bottom, right } = wrapperRec.bounds;
  const { x, y } = childRec.bounds;
  return x >= left && x <= right && y >= top && y <= bottom;
};

async function extractPizzas() {
  // function extractPizzas() {
  // Get all selected objects
  const objects = await miro.board.selection.get()
  // Get all red circles
  const circles = objects.filter((object) => (object.type === "SHAPE") && (object.style.shapeType === 4))
  // Get all cards with numbers on them
  const idCards = objects.filter((object) => (object.type === "CARD") && (isNaN(parseInt(object.title.replace(/<\/?[^>]+(>|$)/g, "")))) !== true)

  const pizzas = [];

  for (const circle of circles) {
    const pizza = {};
    pizza.name = circle.text.replace(/<\/?[^>]+(>|$)/g, "")
    const containedIdCards = idCards
      .filter((idCard) => {
        return rectContains(circle, idCard);
      })
    pizza.ids = containedIdCards.map((idCard) => {
      return parseInt(idCard.title.replace(/<\/?[^>]+(>|$)/g, ""))
    })
    if (pizza.ids.length > 0) {
      pizzas.push(pizza)
    }
  }

  const identifiedIds = pizzas.reduce((total, pizza) => total.concat(pizza.ids), []);
  if (identifiedIds.length !== idCards.length) {
    console.log(`${idCards.length - identifiedIds.length} of the stickers is outside of the pizzas.`)
  }

  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pizzas, null, 2));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "pizzas.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}