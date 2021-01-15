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
            console.log("Hello world")
          } else {
            miro.board.ui.openModal('not-authorized.html').then((res) => {
              if (res === 'success') {
                console.log("Hello world")
              }
            })
          }
        }
      },
    }
  })
})