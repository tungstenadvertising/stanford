
gsap.set('#info-block > *', {opacity: 0, y: 20})
// ammount to add on each button press
      const confettiCount = 200
      const sequinCount = 10

      // "physics" variables
      const gravityConfetti = 0.3
      const gravitySequins = 0.25
      const dragConfetti = 0.07
      const dragSequins = 0.02
      const terminalVelocity = 3

      // init other global elements
      const congrats = document.querySelector('.congratulations_box')
      var disabled = false
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      let cx = ctx.canvas.width / 2
      let cy = ctx.canvas.height / 2

      // add Confetto/Sequin objects to arrays to draw them
      let confetti = []
      let sequins = []

      // colors, back side is darker for confetti flipping
      const colors = [
        { front: '#FFAF00', back: '#FFF1D3' }, // yellow
        { front: '#FF0E41', back: '#FFE0E6' }, // red
        { front: '#FF41AA', back: '#FFE5F4' }, // pink
        { front: '#00D339', back: '#EAFFF0' },  // green
        { front: '#008DF0', back: '#AFDEFF' },  // blue
      ]


      // helper function to pick a random number within a range
      randomRange = (min, max) => Math.random() * (max - min) + min

      // helper function to get initial velocities for confetti
      // this weighted spread helps the confetti look more realistic
      initConfettoVelocity = (xRange, yRange) => {
        const x = randomRange(xRange[0], xRange[1])
        const range = yRange[1] - yRange[0] + 1
        let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range)
        if (y >= yRange[1] - 1) {
          // Occasional confetto goes higher than the max
          y += (Math.random() < .25) ? randomRange(1, 5) : 0
        }
        return { x: x, y: -y }
      }

      // Confetto Class
      function Confetto() {
        this.randomModifier = randomRange(0, 99)
        this.color = colors[Math.floor(randomRange(0, colors.length))]
        this.dimensions = {
          x: randomRange(2, 10),
          y: randomRange(8, 15),
        }
        this.position = {
          x: randomRange(congrats.offsetWidth / 7, congrats.offsetWidth * 0.9),
          y: randomRange(congrats.offsetHeight / 7, congrats.offsetHeight / 5),
          // y: 200
        }
        this.rotation = randomRange(0, 2 * Math.PI)
        this.scale = {
          x: 1,
          y: 1,
        }
        this.velocity = initConfettoVelocity([-9, 9], [6, 11])
      }
      Confetto.prototype.update = function () {
        // apply forces to velocity
        this.velocity.x -= this.velocity.x * dragConfetti
        this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
        this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

        // set position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // spin confetto by scaling y and set the color, .09 just slows cosine frequency
        this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
      }

      // Sequin Class
      function Sequin() {
        this.color = colors[Math.floor(randomRange(0, colors.length))].back,
          this.radius = randomRange(1, 2),
          this.position = {
            x: randomRange(congrats.offsetWidth / 2, congrats.offsetWidth * 1.3),
            // y: randomRange(congrats.offsetHeight / 1.2, congrats.offsetHeight / 3),
            y: 50
          },
          this.velocity = {
            x: randomRange(-6, 6),
            y: randomRange(-8, -12)
          }
      }
      Sequin.prototype.update = function () {
        // apply forces to velocity
        this.velocity.x -= this.velocity.x * dragSequins
        this.velocity.y = this.velocity.y + gravitySequins

        // set position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
      }

      // add elements to arrays to be drawn
      initBurst = () => {
        for (let i = 0; i < confettiCount; i++) {
          confetti.push(new Confetto())
        }
        for (let i = 0; i < sequinCount; i++) {
          sequins.push(new Sequin())
        }
      }

      // draws the elements on the canvas
      render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        confetti.forEach((confetto, index) => {
          let width = (confetto.dimensions.x * confetto.scale.x)
          let height = (confetto.dimensions.y * confetto.scale.y)

          // move canvas to position and rotate
          ctx.translate(confetto.position.x, confetto.position.y)
          ctx.rotate(confetto.rotation)

          // update confetto "physics" values
          confetto.update()

          // get front or back fill color
          ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back

          // draw confetto
          ctx.fillRect(-width / 2, -height / 2, width, height)

          // reset transform matrix
          ctx.setTransform(1, 0, 0, 1, 0, 0)

          // clear rectangle where button cuts off
          // if (confetto.velocity.y < 0) {
          //   ctx.clearRect(canvas.width/2 - congrats.offsetWidth/2, canvas.height/2 + congrats.offsetHeight/2, congrats.offsetWidth, congrats.offsetHeight)
          // }
        })

        sequins.forEach((sequin, index) => {
          // move canvas to position
          ctx.translate(sequin.position.x, sequin.position.y)

          // update sequin "physics" values
          sequin.update()

          // set the color
          ctx.fillStyle = sequin.color

          // draw sequin
          ctx.beginPath()
          ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI)
          ctx.fill()

          // reset transform matrix
          ctx.setTransform(1, 0, 0, 1, 0, 0)

          // clear rectangle where button cuts off
          if (sequin.velocity.y < 0) {
            ctx.clearRect(canvas.width / 2 - congrats.offsetWidth / 1, canvas.height / 2 + congrats.offsetHeight / 2, congrats.offsetWidth, congrats.offsetHeight / 5)
          }
        })

        // remove confetti and sequins that fall off the screen
        // must be done in seperate loops to avoid noticeable flickering
        confetti.forEach((confetto, index) => {
          if (confetto.position.y >= canvas.height) confetti.splice(index, 1)
        })
        sequins.forEach((sequin, index) => {
          if (sequin.position.y >= canvas.height) sequins.splice(index, 1)
        })

        window.requestAnimationFrame(render)
      }

      // re-init canvas if the window size changes
      resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        cx = ctx.canvas.width / 2
        cy = ctx.canvas.height / 2
      }

      // resize listenter
      window.addEventListener('resize', () => {
        resizeCanvas()
      })

      // click button on spacebar or return keypress
      document.body.onkeyup = (e) => {
        if (e.keyCode == 13 || e.keyCode == 32) {
          window.initBurst()
        }
      }

      render()




      const infoBlock = document.querySelector('#info-block')

      const welcomeText = new SplitType('#envelope-text-welcome')
      const nameText = new SplitType('#envelope-text-name')



      const congratsTL = gsap.timeline({
        paused: true,
        onComplete: () => {
          gsap.fromTo('#info-block > *', {
            opacity: 0,
            y: 20
        },{
            opacity: 1,
            y:0,
            duration: 1,
            ease: 'power2.out',
            stagger: 0.2,
          });
        },
        // Adjust this value to make the timeline slower (e.g., 0.5 for half speed)
      });
      congratsTL.timeScale(0.85); // Set the initial time scale to 0.5 (half speed)

      // toggle envelope
      const openMessage = document.querySelector('#open-message')
      const toggleBtn = document.querySelector('#congratulations-btn')
      const envelope = document.querySelector('#envelope')

      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();

        congratsTL.play();
      })

      congratsTL
        .fromTo(openMessage, {
          opacity: 1,
          scale: 1,
          onComplete: function () {
            gsap.set('#envelope-text-welcome', {opacity: 1});
            gsap.set('#envelope-text-name', {opacity: 1});
          }
        }, {
          opacity: 0,
          scale: 0,
          duration: .7,
          ease: 'back.inOut(1.7)'
        })
        .to('#envelope', {
          y: 200,
          ease: 'circ.out',
          duration: 1.8
        }, "<")
        .to('#envelope .cover', {
          rotateX: 180,
          duration: .3,
          ease: 'power3.out',
          onStart: function () {
            envelope.classList.toggle('opened')
          }
        }, "<15%")
        .fromTo('#envelope .scene', {
          y: 200,
          scale: 0.5,
          opacity: 0,
          transformOrigin: 'center'
        }, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          onComplete: function () {
            window.initBurst()
          }
        }, "<80%")
        .to('#envelope .cover', {
          y: 50,
          duration: .2,
        }, "<")
        .fromTo('#envelope .scene .sun path', {
          transformOrigin: 'center',
          scale: 0,
        }, {
          scale: 1,
          duration: 1,
          stagger: .2,
          delay: 1,
          ease: 'back.out(1.4)',
        }, "1")
        .fromTo('#envelope .scene .flare', {
          scale: 0,
          x: -50,
          y: -35,
          transformOrigin: 'center'
        }, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power4.out'
        }, "<50%")
        .fromTo('#envelope .scene .clouds > *', {
          opacity: 0,
          x: 'random(-50, 50, 5)',
        }, {
          x: 0,
          duration: 1,
          opacity: 1,
          ease: 'back.out(1.4)',
          stagger: .4
        }, '0.8')
        .fromTo('#envelope .scene .people .person', {
          opacity: 0,
          // scale: 0.5,
          x: 'random(-30, 30, 5)',
          transformOrigin: 'center'
        }, {
          scale: 1,
          x: 0,
          opacity: 1,
          duration: .7,
          stagger: .1,
          ease: 'power2.out'
        }, "<")
        .fromTo('#envelope .congratulations', {
          opacity: 0,
          scale: 1.1,
          transformOrigin: 'center'
        }, {
          scale: 1,
          opacity: 1,
          duration: .5,
          ease: 'power4.out'
        }, "<")
        .fromTo('#envelope .congratulations .letters .letter', {
          opacity: 0,
          // y: 20,
          scale: 0.5,
          transformOrigin: 'center',
        }, {
          // y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'back.out(4)',
          stagger: .07
        }, "<25%")
        .fromTo('#envelope .stethoscope', {
          opacity: 0,
          y: -5,
        }, {
          y: 0,
          opacity: 1,
          duration: .5,
          ease: 'power3.out',
        }, "<50%")
        // .fromTo('#envelope .trees', {
        //   opacity: 0,
        //   x: 'random(-20, 20, 1)',
        // }, {
        //   x: 0,
        //   opacity: 1,
        //   duration: 1,
        //   ease: 'power2.out'
        // }, "<50%")

        .fromTo('#envelope-text-welcome .char', {
          opacity: 0,
        }, {
          opacity: 1,
          duration: .2,
          stagger: .05,
        })
        .fromTo('#envelope-text-name .char', {
          opacity: 0,
          y: 10
        }, {
          y: 0,
          opacity: 1,
          duration: .3,
          stagger: .1,

        }, '<50%')
