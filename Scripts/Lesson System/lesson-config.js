export const LESSONS = {
  lesson1: {
    id: "lesson1",
    title: "1st Law of Thermodynamics",
    prerequisite: null,
    unlocksVideos: ["eggTray", "candleSpoon"],
    sections: {
      motivation: {
        label: "Motivation",
        rewardKey: "motivation",
        content: [
          {
            type: "heading",
            text: "Motivation"
          },
          {
            type: "paragraph",
            text: "In many Filipino households, cooking is a daily activity that involves more science than we often realize. When we prepare dishes like sinigang, heat from the stove transfers to the pot and the soup inside it, causing changes in temperature."
          },
          {
            type: "paragraph",
            text: "As the soup continues to cook, the heat spreads from the flame to the pot, then to the ingredients, and even to the surrounding air. This shows that energy is constantly moving and being transferred during the cooking process."
          },
          {
            type: "paragraph",
            text: "These everyday experiences reveal an important idea in science: energy does not disappear but is transferred and transformed from one form to another."
          },
          {
            type: "paragraph",
            text: "This concept is explained by the First Law of Thermodynamics, which describes how energy is conserved in any system."
          },
          {
            type: "paragraph",
            text: "Understanding this law helps us explain many real-life situations, such as how heat moves during cooking, how appliances like electric irons work, and how engines use energy to produce motion."
          },
          {
            type: "paragraph",
            text: "When we cook sinigang on the stove, how does the heat from the flame affect the soup and the pot?"
          },
          {
            type: "image",
            src: "../Assets/Lesson 1/motivation.jpg",
            alt: "Cooking sinigang showing heat transfer from the stove to the pot and soup",
            caption: "Cooking can show how energy is transferred within a system.",
            align: "center",
            size: "medium"
          }
        ]
      },

      diagnostic: {
        label: "Diagnostic Test",
        rewardKey: "diagnostic",
        content: [
          {
            type: "heading",
            text: "Diagnostic Test"
          },
          {
            type: "paragraph",
            text: "Answer the questions below."
          }
        ],
        quiz: {
          mode: "diagnostic",
          title: "Diagnostic Test",
          startButtonText: "Start Quiz",
          questions: [
            {
              id: "l1_diag_1",
              question: "When you use an electric iron to press your barong, the iron heats up and the fabric becomes smooth. According to the First Law of Thermodynamics, what happens to the heat energy from the iron?",
              image: {
                src: "../Assets/Lesson 1/diagnostic-1.jpg",
                alt: "An electric iron pressing a barong"
              },
              choices: [
                "It disappears once the barong is ironed.",
                "It transfers to the iron plate, the fabric, and the surrounding air.",
                "It only heats the fabric but not the iron plate.",
                "It turns into a clean smell for the barong."
              ],
              correctIndex: 1
            },
            {
              id: "l1_diag_2",
              question: "When a jeepney drives around town, the engine gets hot while the vehicle moves. What happens to the energy from the burning fuel?",
              image: {
                src: "../Assets/Lesson 1/diagnostic-2.jpg",
                alt: "A jeepney moving with an engine producing motion, heat, and sound"
              },
              choices: [
                "It only moves the jeepney; the engine does not get hot.",
                "It is transformed into motion, heat, and sound energy.",
                "The energy disappears after moving the jeepney.",
                "Fuel energy turns into road friction."
              ],
              correctIndex: 1
            },
            {
              id: "l1_diag_3",
              question: "A vendor boils water to make taho early in the morning. Which statement best shows the First Law of Thermodynamics?",
              image: {
                src: "../Assets/Lesson 1/diagnostic-3.jpg",
                alt: "A vendor boiling water for taho"
              },
              choices: [
                "Heat from the stove disappears after the water boils.",
                "Heat energy from the stove transfers to the water, the pot, and the surrounding air without being destroyed.",
                "The water creates heat energy on its own.",
                "Only the pot absorbs energy; the water stays the same temperature."
              ],
              correctIndex: 1
            },
            {
              id: "l1_diag_4",
              question: "Which statement correctly expresses the First Law of Thermodynamics?",
              image: {
                src: "../Assets/Lesson 1/diagnostic-4.jpg",
                alt: "An infographic about energy conservation and transformation"
              },
              choices: [
                "Energy can be created or destroyed depending on the situation.",
                "Energy cannot be created or destroyed; it only changes form.",
                "Heat energy is always lost to the surroundings.",
                "Work done by a system creates new energy."
              ],
              correctIndex: 1
            },
            {
              id: "l1_diag_5",
              question: "When morning sunlight enters a classroom, the floor and walls feel warm. How does this demonstrate the First Law?",
              image: {
                src: "../Assets/Lesson 1/diagnostic-5.jpg",
                alt: "Sunlight entering a classroom and warming surfaces"
              },
              choices: [
                "The sunlight creates energy inside the room.",
                "Heat energy from the sunlight is transferred to the floor, walls, and air.",
                "The energy disappears once it reaches the floor.",
                "The floor and walls produce energy on their own."
              ],
              correctIndex: 1
            }
          ]
        }
      },

      content: {
        label: "Lesson",
        rewardKey: "content",
        content: [
          {
            type: "heading",
            text: "The First Law of Thermodynamics"
          },
          {
            type: "paragraph",
            text: "You’ve probably seen heat at work without realizing the science behind it, like when water boils, an iron gets hot, or your sinigang simmers on the stove. Everyday Filipino life is full of energy in motion. Today we learn a fundamental rule that helps us understand all these changes: energy doesn’t disappear, it just moves or transforms."
          },
          {
            type: "paragraph",
            text: "In this lesson, you will learn what this law means, how it applies to systems around us, and how it helps explain everyday phenomena from engines warming up to the heat in a kitchen."
          },
          {
            type: "heading",
            text: "Understanding the First Law of Thermodynamics"
          },
          {
            type: "paragraph",
            text: "The First Law of Thermodynamics is one of the most important principles in physics. It tells us how energy behaves in any process that involves heat or work. Simply put, it says:"
          },
          {
            type: "paragraph",
            text: "Energy cannot be created or destroyed — it can only change form or be transferred from one part of a system to another."
          },
          {
            type: "paragraph",
            text: "This law is a scientific restatement of the law of conservation of energy, developed through experiments by scientists such as Rudolf Clausius and William Thomson (Lord Kelvin) in the 19th century. In modern physics, the First Law forms the foundation for how we understand engines, heating, cooling, and even biological processes."
          },
          {
            type: "image",
            src: "../Assets/Lesson 1/first-law.jpg",
            alt: "Infographic for the First Law of Thermodynamics",
            caption: "Energy is conserved even as it moves or changes form.",
            align: "center",
            size: "medium"
          },
          {
            type: "heading",
            text: "First Law of Thermodynamics Equation"
          },
          {
            type: "paragraph",
            text: "In modern terms, the law is expressed as:"
          },
          {
            type: "paragraph",
            text: "ΔU = Q - W"
          },
          {
            type: "list",
            items: [
              "ΔU = change in internal energy of a system",
              "Q = heat added to the system",
              "W = work done by the system"
            ]
          },
          {
            type: "paragraph",
            text: "This equation shows that the internal energy changes depending on the heat entering the system and the work it performs, but the total energy is always conserved."
          },
          {
            type: "image",
            src: "../Assets/Lesson 1/equation.jpg",
            alt: "Illustration of the equation ΔU = Q - W",
            caption: "The First Law equation tracks energy entering, leaving, and changing inside a system.",
            align: "center",
            size: "medium"
          },
          {
            type: "paragraph",
            text: "Now, let’s connect this to cooking sinigang na baboy. The flame from the stove releases energy in the form of heat, which transfers to the metal pot, raising its temperature. The pot then passes heat to the soup and ingredients inside."
          },
          {
            type: "paragraph",
            text: "In this scenario, the gas flame provides Q, increasing the internal energy (ΔU) of the soup and making it hotter. At the same time, steam escapes and bubbles rise, representing W, the work done by the system."
          },
          {
            type: "paragraph",
            text: "This shows that the equation ΔU = Q - W is more than just symbols; it tells the story of your kitchen. The energy from the flame doesn’t vanish — it transforms into the comforting warmth of the broth, softened vegetables, and the aroma filling the room."
          },
          {
            type: "image",
            src: "../Assets/Lesson 1/sinigang-equation.jpg",
            alt: "Sinigang example showing heat added, internal energy, and work",
            caption: "The First Law can be explained through a familiar cooking process.",
            align: "center",
            size: "medium"
          },
          {
            type: "heading",
            text: "Energy and Its Forms"
          },
          {
            type: "paragraph",
            text: "Energy comes in many forms, all obeying the First Law: thermal (heat), mechanical (motion), chemical, electrical, and radiant (light) energy."
          },
          {
            type: "paragraph",
            text: "In everyday Filipino life, these forms appear everywhere. A jeepney engine burns fuel, turning chemical energy into motion, heat, and sound. Ironing a barong converts electrical energy into heat that smooths the fabric. Boiling water or cooking sinigang transfers heat from the stove to the pot, then into the soup, with some energy dispersing into the air. Even sunlight entering a classroom changes from radiant energy into thermal energy, warming walls and floors."
          },
          {
            type: "paragraph",
            text: "In all cases, energy changes form or moves, but it is never lost, demonstrating the First Law in action."
          },
          {
            type: "image",
            src: "../Assets/Lesson 1/forms-of-energy.jpg",
            alt: "Examples of thermal, mechanical, chemical, electrical, and radiant energy",
            caption: "Many everyday situations show energy changing form without being destroyed.",
            align: "center",
            size: "large"
          },
          {
            type: "paragraph",
            text: "Understanding the First Law of Thermodynamics helps us see the science behind everyday Filipino life. Next, to experience it even more, we will proceed to watch laboratory activity videos that show how energy really transfers and transforms in real experiments."
          }
        ]
      },

video: {
  label: "Video Demonstration",
  rewardKey: "video",
  videos: [
    {
      id: "eggTray",
      title: "Egg Tray Heat Absorption Test",
      embedUrl: "https://www.youtube-nocookie.com/embed/GOhESfdDyYA",
      description: {
        objectives: [
          "To demonstrate the First Law of Thermodynamics by observing how heat energy is transferred and how color affects the absorption of heat."
        ],
        materials: [
          "Egg tray",
          "Black paint",
          "Paintbrush",
          "Scissors",
          "Thermometer",
          "Two instant noodle cups",
          "Hot water"
        ],
        procedure: [
          "Prepare all the materials and place them on a flat and stable surface.",
          "Using scissors, cut the egg tray into two equal pieces.",
          "Leave one piece in its natural color, and paint the other piece black using black paint. Allow the painted tray to dry completely.",
          "Pour hot water into two instant noodle cups. Make sure both cups contain approximately the same amount of hot water.",
          "Place one egg tray piece on top of each cup. One cup should have the natural-colored tray, while the other cup should have the black-painted tray.",
          "Allow the trays to remain in place for a few minutes so that heat from the hot water can transfer to the trays.",
          "After several minutes, use a thermometer to measure the temperature of each tray.",
          "Compare the temperature readings of the two trays and record your observations.",
          "Analyze which tray absorbed more heat and relate the results to heat absorption and energy transfer."
        ]
      }
    },
    {
      id: "candleSpoon",
      title: "Candle Heating Water in a Spoon",
      embedUrl: "https://www.youtube-nocookie.com/embed/sfWw-yyIoi8",
      description: {
        objectives: [
          "To demonstrate the conversion of chemical energy into heat energy and observe how heat energy from a flame is transferred to water."
        ],
        materials: [
          "Candle",
          "Metal spoon",
          "Small amount of water",
          "Lighter or match",
          "Tissue or cloth (optional, for handling the spoon if it becomes hot)"
        ],
        procedure: [
          "Prepare all the materials and place them on a stable, flat surface.",
          "Position the candle securely so it will not easily tip over.",
          "Carefully light the candle using a lighter or match.",
          "Pour a small amount of water into the metal spoon, just enough to cover the bottom.",
          "Hold the handle of the spoon and carefully place the spoon above the candle flame so that the bottom of the spoon is exposed to the heat.",
          "Keep the spoon steady above the flame and observe the changes happening to the water.",
          "After some time, observe if the temperature of the water increases or if small bubbles begin to form.",
          "Continue observing for a few moments and take note of what happens to the water as it absorbs heat from the flame.",
          "Once the observation is complete, carefully remove the spoon from the flame.",
          "Extinguish the candle and allow the spoon to cool before placing it down."
        ]
      }
    }
  ],
  content: [
    {
      type: "heading",
      text: "Video Demonstration"
    },
    {
      type: "paragraph",
      text: "Watch both demonstrations in order before proceeding to the lab discussion."
    },
    {
      type: "list",
      items: [
        "Egg Tray Heat Absorption Test",
        "Candle Heating Water in a Spoon"
      ]
    }
  ]
},

lab: {
  label: "Lab Discussion",
  rewardKey: "labDiscussion",
  content: [
    {
      type: "heading",
      text: "Lab Discussion"
    },
    {
      type: "paragraph",
      text: "Answer the post-lab questions based on the demonstrations you just watched."
    }
  ],
  quiz: {
    mode: "lab",
    title: "Lab Discussion",
    startButtonText: "Start Lab Discussion",
    shuffleQuestions: true,
    questions: [
      {
        id: "l1_lab_1",
        sectionTitle: "Egg Tray Heat Absorption Test",
        question: "What was the purpose of painting one piece of the egg tray black?",
        choices: [
          "To make the tray stronger",
          "To compare how different colors absorb heat",
          "To make the tray waterproof",
          "To decorate the tray"
        ],
        correctIndex: 1,
        explanation: "One tray remained its natural color while the other was painted black so we could compare how color affects heat absorption."
      },
      {
        id: "l1_lab_2",
        sectionTitle: "Egg Tray Heat Absorption Test",
        question: "In the experiment, what served as the heat source?",
        choices: [
          "The egg tray",
          "The thermometer",
          "The hot water in the cups",
          "The paint"
        ],
        correctIndex: 2,
        explanation: "The hot water provided the thermal energy. Heat from the water transferred upward to the egg trays placed on top of the cups."
      },
      {
        id: "l1_lab_3",
        sectionTitle: "Egg Tray Heat Absorption Test",
        question: "Why did the black egg tray often become warmer than the unpainted tray?",
        choices: [
          "Black paint makes materials heavier",
          "Dark colors absorb more heat energy",
          "The thermometer touched the black tray longer",
          "The black tray was closer to the water"
        ],
        correctIndex: 1,
        explanation: "Dark colors absorb more thermal energy compared to lighter colors, which is why the black tray usually becomes warmer."
      },
      {
        id: "l1_lab_4",
        sectionTitle: "Egg Tray Heat Absorption Test",
        question: "What tool was used to measure the temperature of the egg trays?",
        choices: [
          "Timer",
          "Spoon",
          "Thermometer",
          "Ruler"
        ],
        correctIndex: 2,
        explanation: "The thermometer was used to measure and compare the temperature of the trays after heat was transferred from the hot water."
      },
      {
        id: "l1_lab_5",
        sectionTitle: "Egg Tray Heat Absorption Test",
        question: "What observation shows that heat energy was transferred to the egg tray?",
        choices: [
          "The cups changed color",
          "The egg tray’s temperature increased",
          "The water disappeared",
          "The paint dried faster"
        ],
        correctIndex: 1,
        explanation: "When the tray absorbs heat energy from the hot water, its temperature rises. This increase in temperature shows that energy transfer occurred."
      },

      {
        id: "l1_lab_6",
        sectionTitle: "Candle Heating Water in a Spoon",
        question: "What was the main purpose of placing water in the metal spoon above the candle flame?",
        choices: [
          "To make the candle burn brighter",
          "To observe how heat from the flame affects the water",
          "To cool down the spoon",
          "To stop the candle from melting"
        ],
        correctIndex: 1,
        explanation: "The water was placed in the spoon so we could observe how heat from the candle flame transfers to the water and increases its temperature."
      },
      {
        id: "l1_lab_7",
        sectionTitle: "Candle Heating Water in a Spoon",
        question: "What type of energy is stored in the candle wax before it is burned?",
        choices: [
          "Electrical energy",
          "Mechanical energy",
          "Chemical energy",
          "Sound energy"
        ],
        correctIndex: 2,
        explanation: "The candle wax contains chemical energy stored in its molecular bonds. When the candle burns, this chemical energy is released during combustion."
      },
      {
        id: "l1_lab_8",
        sectionTitle: "Candle Heating Water in a Spoon",
        question: "During the experiment, what forms of energy were produced by the burning candle?",
        choices: [
          "Heat energy and light energy",
          "Electrical energy and sound energy",
          "Mechanical energy and magnetic energy",
          "Nuclear energy and sound energy"
        ],
        correctIndex: 0,
        explanation: "When the candle wax burns, chemical energy is transformed into heat energy and light energy through the process of combustion."
      },
      {
        id: "l1_lab_9",
        sectionTitle: "Candle Heating Water in a Spoon",
        question: "Why did the temperature of the water increase while the spoon was held above the flame?",
        choices: [
          "The spoon produced its own heat",
          "Heat energy transferred from the flame to the spoon and then to the water",
          "The water created energy by itself",
          "The air around the spoon cooled the water"
        ],
        correctIndex: 1,
        explanation: "Heat energy transferred from the flame to the spoon and then to the water."
      },
      {
        id: "l1_lab_10",
        sectionTitle: "Candle Heating Water in a Spoon",
        question: "What observation shows that the water was absorbing heat energy?",
        choices: [
          "The spoon changed color",
          "The candle became shorter",
          "Tiny bubbles started forming in the water",
          "The flame became smaller"
        ],
        correctIndex: 1,
        explanation: "The formation of tiny bubbles indicates that the water temperature is increasing as it absorbs heat energy from the flame."
      }
    ]
  }
},

      assessment: {
        label: "Assessment",
        rewardKey: "assessment",
        content: [
          {
            type: "heading",
            text: "Assessment"
          },
          {
            type: "paragraph",
            text: "Directions: Choose the best answer."
          }
        ],
        quiz: {
          mode: "assessment",
          title: "Assessment",
          startButtonText: "Start Assessment",
          questions: [
            {
              id: "l1_assess_1",
              question: "The First Law of Thermodynamics states that energy can:",
              choices: [
                "be created",
                "be destroyed",
                "be created and destroyed",
                "be transferred or transformed but not created or destroyed"
              ],
              correctIndex: 3
            },
            {
              id: "l1_assess_2",
              question: "When cooking rice using a stove, the heat from the fire:",
              choices: [
                "disappears",
                "is destroyed",
                "is transferred to the pot and rice",
                "stays in the stove"
              ],
              correctIndex: 2
            },
            {
              id: "l1_assess_3",
              question: "When ice melts in halo-halo, the energy from the surroundings:",
              choices: [
                "disappears",
                "turns into coldness",
                "is transferred to the ice",
                "is destroyed"
              ],
              correctIndex: 2
            },
            {
              id: "l1_assess_4",
              question: "Which of the following best describes heat (Q)?",
              choices: [
                "Energy stored in an object",
                "Energy transferred due to temperature difference",
                "Energy that disappears",
                "Force applied to an object"
              ],
              correctIndex: 1
            },
            {
              id: "l1_assess_5",
              question: "Which of the following is an example of work (W)?",
              choices: [
                "Ice melting in a drink",
                "A fan blowing air using electricity",
                "Heat staying in one place",
                "A cold object heating itself"
              ],
              correctIndex: 1
            },
            {
              id: "l1_assess_6",
              question: "In a system, when heat is added, it can:",
              choices: [
                "disappear",
                "be converted into work or stored as internal energy",
                "be destroyed",
                "remain unused"
              ],
              correctIndex: 1
            },
            {
              id: "l1_assess_7",
              question: "What happens to the total energy in an isolated system?",
              choices: [
                "It increases",
                "It decreases",
                "It remains constant",
                "It disappears"
              ],
              correctIndex: 2
            },
            {
              id: "l1_assess_8",
              question: "When a cup of hot coffee cools down on a rainy day, the energy:",
              choices: [
                "is lost completely",
                "is transferred to the surrounding air",
                "is destroyed",
                "stays inside the coffee"
              ],
              correctIndex: 1
            },
            {
              id: "l1_assess_9",
              question: "Which situation best shows energy transformation?",
              choices: [
                "A lamp lighting up using a battery",
                "Ice not melting",
                "A rock staying still forever",
                "Heat disappearing"
              ],
              correctIndex: 0
            },
            {
              id: "l1_assess_10",
              question: "Which statement correctly applies the First Law of Thermodynamics?",
              choices: [
                "Energy can be created when needed",
                "Energy can be destroyed after use",
                "Energy only exists in hot objects",
                "Energy changes form but is not lost"
              ],
              correctIndex: 3
            }
          ]
        }
      }
    }
  },

  lesson2: {
    id: "lesson2",
    title: "2nd Law of Thermodynamics",
    prerequisite: "lesson1",
    unlocksVideos: ["grainMixing", "barakoGatas"],
    sections: {
      motivation: {
        label: "Motivation",
        rewardKey: "motivation",
        content: [
          {
            type: "heading",
            text: "Motivation"
          },
          {
            type: "paragraph",
            text: "In everyday Filipino life, we often experience changes in temperature without realizing the science behind them. For example, when we leave a cup of hot coffee on a table during a rainy afternoon in Manila, it gradually becomes cooler even without touching it."
          },
          {
            type: "paragraph",
            text: "As time passes, the heat from the coffee spreads to the surrounding air until both reach the same temperature. Similarly, when we put ice in halo-halo or cold drinks on a hot day, the ice slowly melts as heat from the warmer surroundings transfers to the colder ice."
          },
          {
            type: "paragraph",
            text: "These common experiences show a natural pattern: heat always flows from a hotter object to a colder one, and energy spreads out over time."
          },
          {
            type: "paragraph",
            text: "This concept is explained by the Second Law of Thermodynamics, which describes how energy flows in a certain direction and how systems tend to become more disordered."
          },
          {
            type: "paragraph",
            text: "Understanding this law helps us explain many real-life situations, such as why ice melts in drinks, why engines cannot be perfectly efficient, and why energy transformations always involve some loss of usable energy."
          },
          {
            type: "paragraph",
            text: "When you leave a hot drink or place ice in a warm environment, how does heat flow and affect the system over time?"
          },
          {
            type: "image",
            src: "../Assets/Lesson 2/motivation.png",
            alt: "Hot coffee cooling and ice melting in a warm environment",
            caption: "Everyday experiences can reveal the natural direction of heat flow.",
            align: "center",
            size: "medium"
          }
        ]
      },

      diagnostic: {
        label: "Diagnostic Test",
        rewardKey: "diagnostic",
        content: [
          {
            type: "heading",
            text: "Diagnostic Test"
          },
          {
            type: "paragraph",
            text: "Answer the questions below."
          }
        ],
        quiz: {
          mode: "diagnostic",
          title: "Diagnostic Test",
          startButtonText: "Start Quiz",
          questions: [
            {
              id: "l2_diag_1",
              question: "A cup of hot coffee is left on a table. After some time, it becomes cold. What does this show?",
              image: {
                src: "../Assets/Lesson 2/diagnostic.jpg",
                alt: "A cup of hot coffee cooling on a table"
              },
              choices: [
                "Heat flows from cold to hot objects.",
                "Heat naturally flows from hot to cold objects.",
                "Heat disappears completely.",
                "Coldness enters the coffee."
              ],
              correctIndex: 1
            },
            {
              id: "l2_diag_2",
              question: "A student takes ice from the freezer and places it outside. What will happen?",
              image: {
                src: "../Assets/Lesson 2/diagnostic.jpg",
                alt: "Ice from a freezer starting to melt outside"
              },
              choices: [
                "The ice will become colder.",
                "The ice will melt as heat flows from the surroundings.",
                "The ice will stay the same forever.",
                "The ice will create its own cold energy."
              ],
              correctIndex: 1
            },
            {
              id: "l2_diag_3",
              question: "A vendor cooking kwek-kwek notices that oil splatters and heat spreads around. What does this demonstrate?",
              image: {
                src: "../Assets/Lesson 2/diagnostic.jpg",
                alt: "A vendor cooking kwek-kwek with heat and oil spreading"
              },
              choices: [
                "Energy stays in one place.",
                "Heat spreads out and becomes less organized.",
                "Heat disappears instantly.",
                "The oil absorbs all energy permanently."
              ],
              correctIndex: 1
            },
            {
              id: "l2_diag_4",
              question: "Which statement best describes the Second Law of Thermodynamics?",
              image: {
                src: "../Assets/Lesson 2/diagnostic.jpg",
                alt: "Infographic about heat flow and entropy"
              },
              choices: [
                "Energy can be created.",
                "Heat flows naturally from hot to cold, and systems become more disordered.",
                "Energy disappears in all processes.",
                "Work always creates order."
              ],
              correctIndex: 1
            },
            {
              id: "l2_diag_5",
              question: "Why does a classroom become warm during a hot afternoon?",
              image: {
                src: "../Assets/Lesson 2/diagnostic.jpg",
                alt: "A classroom warming during a hot afternoon"
              },
              choices: [
                "The room creates its own heat.",
                "Heat from outside enters and spreads inside the room.",
                "Cold air enters and heats up.",
                "The walls produce energy."
              ],
              correctIndex: 1
            }
          ]
        }
      },

      content: {
        label: "Lesson",
        rewardKey: "content",
        content: [
          {
            type: "heading",
            text: "The Second Law of Thermodynamics"
          },
          {
            type: "paragraph",
            text: "You’ve probably noticed heat moving from hot to cold without realizing the science behind it. Everyday Filipino life is full of such examples: hot coffee cooling on a table during a rainy afternoon in Manila, ice melting in halo-halo on a hot day, or food gradually cooling after cooking. These are all everyday experiences where energy spreads and changes naturally over time."
          },
          {
            type: "paragraph",
            text: "In this lesson, you will learn a fundamental rule that explains why heat flows in one direction and why energy tends to become less organized as it moves. Unlike the First Law, which focuses on the conservation of energy, this law describes the direction of energy flow and introduces the concept of entropy."
          },
          {
            type: "heading",
            text: "Understanding the Second Law of Thermodynamics"
          },
          {
            type: "list",
            items: [
              "The total entropy of an isolated system always increases or remains constant in spontaneous processes.",
              "In simple terms, natural processes tend to move toward greater disorder, and energy spreads out over time."
            ]
          },
          {
            type: "image",
            src: "../Assets/Lesson 2/objectives.jpg",
            alt: "Teacher explaining thermodynamics concepts in class",
            caption: "The Second Law explains direction, disorder, and usable energy.",
            align: "center",
            size: "medium"
          },
          {
            type: "heading",
            text: "Entropy"
          },
          {
            type: "paragraph",
            text: "Entropy is a measure of the disorder or randomness of a system. The higher the entropy, the more disordered and less organized the system becomes."
          },
          {
            type: "list",
            items: [
              "Ice melting into water",
              "Perfume spreading in a room",
              "Hot coffee cooling down"
            ]
          },
          {
            type: "paragraph",
            text: "In each of these cases, energy becomes more dispersed and less available to do useful work."
          },
          {
            type: "image",
            src: "../Assets/Lesson 2/entropy-1.jpg",
            alt: "Illustration of entropy increasing in everyday situations",
            caption: "",
            align: "center",
            size: "medium"
          },
          {
            type: "image",
            src: "../Assets/Lesson 2/entropy-2.jpg",
            alt: "Illustration of entropy increasing in everyday situations",
            caption: "Entropy increases as energy becomes more spread out.",
            align: "center",
            size: "medium"
          },
          {
            type: "heading",
            text: "Direction of Heat Flow"
          },
          {
            type: "paragraph",
            text: "Another way to state the Second Law is: heat naturally flows from a hotter object to a colder object."
          },
          {
            type: "list",
            items: [
              "A hot metal spoon placed in cold water cools down.",
              "Ice melts when placed in warm juice."
            ]
          },
          {
            type: "paragraph",
            text: "Heat will not naturally move from cold to hot unless external work is applied, such as in refrigerators or air conditioners."
          },
          {
            type: "image",
            src: "../Assets/Lesson 2/heat-flow-1.jpg",
            alt: "Examples of heat flowing from hot objects to cold objects",
            caption: "",
            align: "center",
            size: "medium"
          },
          {
            type: "image",
            src: "../Assets/Lesson 2/heat-flow-2.jpg",
            alt: "Examples of heat flowing from hot objects to cold objects",
            caption: "Heat flows in a natural direction unless work is added.",
            align: "center",
            size: "medium"
          },
          {
            type: "heading",
            text: "Entropy Equation"
          },
          {
            type: "paragraph",
            text: "The change in entropy can be expressed as:"
          },
          {
            type: "paragraph",
            text: "ΔS = Q / T"
          },
          {
            type: "list",
            items: [
              "ΔS = change in entropy",
              "Q = heat transferred",
              "T = absolute temperature in Kelvin"
            ]
          },
          {
            type: "paragraph",
            text: "Entropy increases when heat is added to a system, showing that energy spreads out and becomes less available to do work."
          },
          {
            type: "image",
            src: "../Assets/Lesson 2/entropy-equation.jpg",
            alt: "Entropy equation on a classroom board",
            caption: "The entropy equation connects heat transfer to disorder.",
            align: "center",
            size: "medium"
          },
          {
            type: "heading",
            text: "Everyday Examples"
          },
          {
            type: "list",
            items: [
              "Ice melting in halo-halo",
              "Food cooling after cooking",
              "Perfume spreading in a room",
              "Heat from a stove warming the surrounding air"
            ]
          },
          {
            type: "paragraph",
            text: "These examples show the Second Law in action: energy moves naturally from concentrated to dispersed states, and systems tend to become more disordered over time."
          },
          {
            type: "image",
            src: "../Assets/Lesson 2/motivation-2.jpg",
            alt: "Icons showing melting ice, cooling food, perfume spreading, and stove heat",
            caption: "The Second Law appears in many ordinary situations.",
            align: "center",
            size: "large"
          },
          {
            type: "heading",
            text: "Energy and Its Implications"
          },
          {
            type: "paragraph",
            text: "The Second Law also explains why many processes in real life are not perfectly efficient. In machines like jeepney engines, not all energy from fuel is converted into motion. Some energy is always released as heat, which spreads into the surroundings."
          },
          {
            type: "list",
            items: [
              "Engines become hot during use",
              "Appliances release heat",
              "Energy is never fully converted into useful work"
            ]
          },
          {
            type: "paragraph",
            text: "Understanding the Second Law of Thermodynamics helps us see why energy flows in one direction and why disorder increases over time. As we continue, you will observe how this law applies in real experiments and everyday situations around you."
          },
          {
            type: "image",
            src: "../Assets/Lesson 2/summary.jpg",
            alt: "",
            caption: "",
            align: "center",
            size: "large"
          },
        ]
      },

video: {
  label: "Video Demonstration",
  rewardKey: "video",
  videos: [
    {
      id: "grainMixing",
      title: "Mixing Grains",
      embedUrl: "https://www.youtube-nocookie.com/embed/GcauNRyr7Xs",
      description: {
        objectives: [
          "To demonstrate entropy and the Second Law of Thermodynamics by observing how an ordered system naturally progresses toward disorder over time."
        ],
        materials: [
          "Clear container with a lid",
          "Mung beans (munggo)",
          "Rice",
          "Corn kernels"
        ],
        procedure: [
          "Prepare all the materials and place the clear container on a flat, stable surface.",
          "Layer the grains inside the container: place mung beans at the bottom, rice in the middle, and corn kernels on top. Ensure the layers are clean and distinct.",
          "Observe the initial arrangement of the grains. This represents low entropy (high order).",
          "Close the container with the lid securely.",
          "Gently shake the container for a few moments, allowing the grains to move and collide randomly.",
          "Open the container and observe the new arrangement of the grains. The neat layers should now be mixed, representing high entropy (greater disorder).",
          "Note that even if the container is shaken again, the grains do not naturally return to the original layered arrangement.",
          "Record your observations and relate them to the concept of entropy and the Second Law of Thermodynamics."
        ]
      }
    },
    {
      id: "barakoGatas",
      title: "Barako Meets Gatas",
      embedUrl: "https://www.youtube-nocookie.com/embed/W0qezaEQmp8",
      description: {
        objectives: [
          "To demonstrate the Second Law of Thermodynamics by observing how heat flows from a hotter substance to a colder substance until thermal equilibrium is reached."
        ],
        materials: [
          "1 cup of hot kapeng barako",
          "1 cup of cold fresh milk or evaporated milk",
          "Two clear glasses",
          "Spoon",
          "Thermometer",
          "Timer or stopwatch",
          "Optional: food coloring (to make the mixing easier to observe)"
        ],
        procedure: [
          "Prepare all the materials and place them on a stable working surface.",
          "Brew a cup of hot kapeng barako and pour it into one clear glass labeled Hot.",
          "Measure and record the temperature of the hot coffee using a thermometer.",
          "Pour cold milk into another clear glass labeled Cold, then measure and record its temperature.",
          "Slowly pour the hot coffee into the glass containing the cold milk.",
          "Immediately start the timer once the two liquids are combined.",
          "Observe the mixing process as the color of the liquid gradually changes while the coffee and milk combine.",
          "Gently stir the mixture at different time intervals, such as after 10 seconds, 30 seconds, and 1 minute.",
          "Measure the temperature of the mixture again and record the result.",
          "Compare the initial temperatures of the coffee and milk with the final temperature of the mixture and record your observations."
        ]
      }
    }
  ],
  content: [
    {
      type: "heading",
      text: "Video Demonstration"
    },
    {
      type: "paragraph",
      text: "Watch both demonstrations in order before proceeding to the lab discussion."
    },
    {
      type: "list",
      items: [
        "Mixing Grains",
        "Barako Meets Gatas"
      ]
    }
  ]
},

lab: {
  label: "Lab Discussion",
  rewardKey: "labDiscussion",
  content: [
    {
      type: "heading",
      text: "Lab Discussion"
    },
    {
      type: "paragraph",
      text: "Answer the post-lab questions based on the demonstrations you just watched."
    }
  ],
  quiz: {
    mode: "lab",
    title: "Lab Discussion",
    startButtonText: "Start Lab Discussion",
    shuffleQuestions: true,
    questions: [
      {
        id: "l2_lab_1",
        sectionTitle: "Mixing Grains",
        question: "What was the initial arrangement of the grains called?",
        choices: [
          "High Entropy",
          "Low Entropy",
          "Random State",
          "Thermal Equilibrium"
        ],
        correctIndex: 1,
        explanation: "The grains were neatly layered at the start, showing an ordered state. Low entropy means the system is more ordered."
      },
      {
        id: "l2_lab_2",
        sectionTitle: "Mixing Grains",
        question: "What happened when the container was shaken?",
        choices: [
          "The grains returned to the layers",
          "The grains mixed randomly",
          "The grains disappeared",
          "The grains melted"
        ],
        correctIndex: 1,
        explanation: "Shaking caused the grains to move around and mix together, increasing disorder. This demonstrates high entropy."
      },
      {
        id: "l2_lab_3",
        sectionTitle: "Mixing Grains",
        question: "What does high entropy mean in this experiment?",
        choices: [
          "More order",
          "More disorder",
          "Colder temperature",
          "Higher energy"
        ],
        correctIndex: 1,
        explanation: "High entropy represents a more disordered state. The mixed grains show how systems naturally progress toward disorder."
      },
      {
        id: "l2_lab_4",
        sectionTitle: "Mixing Grains",
        question: "Can the grains easily return to the neat layered state after shaking?",
        choices: [
          "Yes, if shaken slowly",
          "No, they naturally stay mixed",
          "Yes, if you use a spoon",
          "No, because Entropy decreases naturally"
        ],
        correctIndex: 1,
        explanation: "Once the grains are mixed, the system tends to remain in high entropy. Systems naturally evolve from low entropy to high entropy."
      },
      {
        id: "l2_lab_5",
        sectionTitle: "Mixing Grains",
        question: "Which principle of thermodynamics does this experiment demonstrate?",
        choices: [
          "First Law - energy conservation",
          "Second Law – entropy increases",
          "Third Law – absolute zero",
          "Zeroth Law – temperature equality"
        ],
        correctIndex: 1,
        explanation: "The experiment shows that systems naturally move from order (low entropy) to disorder (high entropy), illustrating the Second Law of Thermodynamics."
      },

      {
        id: "l2_lab_6",
        sectionTitle: "Barako Meets Gatas",
        question: "What was the purpose of measuring the temperature of the hot coffee and cold milk before mixing them?",
        choices: [
          "To check the color of the liquids",
          "To compare their initial temperatures",
          "To make the liquids taste better",
          "To make the experiment faster"
        ],
        correctIndex: 1,
        explanation: "Measuring the temperatures first helps us observe the difference between the hot coffee and cold milk. This temperature difference is important to show how heat transfers from the hotter liquid to the colder one."
      },
      {
        id: "l2_lab_7",
        sectionTitle: "Barako Meets Gatas",
        question: "What happened when the hot coffee was poured into the cold milk?",
        choices: [
          "The liquids separate completely",
          "The coffee became hotter",
          "The liquids gradually mixed and changed color",
          "The milk disappeared"
        ],
        correctIndex: 2,
        explanation: "As the coffee and milk mixed, their colors blended together. This visible mixing shows how the two substances combine while heat energy is also being transferred."
      },
      {
        id: "l2_lab_8",
        sectionTitle: "Barako Meets Gatas",
        question: "Why did the temperature of the mixture change after the coffee and milk were combined?",
        choices: [
          "Heat moved from the hot coffee to the cold milk",
          "The milk produced its own heat",
          "The thermometer changed the temperature",
          "The spoon added heat to the liquid"
        ],
        correctIndex: 0,
        explanation: "Heat naturally flows from a hotter substance to a colder one. The hot coffee transferred heat to the cold milk until their temperatures began to move toward the same value."
      },
      {
        id: "l2_lab_9",
        sectionTitle: "Barako Meets Gatas",
        question: "What was the purpose of stirring the mixture at different time intervals?",
        choices: [
          "To make the glass colder",
          "To help the liquids mix evenly and observe the changes over time",
          "To make the coffee sweeter",
          "To stop heat transfer"
        ],
        correctIndex: 1,
        explanation: "Stirring allows the coffee and milk to mix more evenly. Observing the mixture at different times helps us see how the color and temperature gradually become uniform."
      },
      {
        id: "l2_lab_10",
        sectionTitle: "Barako Meets Gatas",
        question: "When the coffee and milk reach nearly the same temperature, what has occurred?",
        choices: [
          "Evaporation",
          "Condensation",
          "Thermal equilibrium",
          "Freezing"
        ],
        correctIndex: 2,
        explanation: "Thermal equilibrium happens when two substances that were at different temperatures reach the same temperature after heat transfer. In this experiment, the hot coffee and cold milk eventually reach a similar temperature."
      }
    ]
  }
},

      assessment: {
        label: "Assessment",
        rewardKey: "assessment",
        content: [
          {
            type: "heading",
            text: "Assessment"
          },
          {
            type: "paragraph",
            text: "Directions: Choose the best answer."
          }
        ],
        quiz: {
          mode: "assessment",
          title: "Assessment",
          startButtonText: "Start Assessment",
          questions: [
            {
              id: "l2_assess_1",
              question: "The Second Law of Thermodynamics states that entropy of an isolated system:",
              choices: [
                "decreases",
                "increases or remains constant",
                "disappears",
                "becomes zero"
              ],
              correctIndex: 1
            },
            {
              id: "l2_assess_2",
              question: "Entropy refers to:",
              choices: [
                "amount of heat",
                "amount of force",
                "degree of disorder in a system",
                "number of atoms"
              ],
              correctIndex: 2
            },
            {
              id: "l2_assess_3",
              question: "Heat naturally flows from:",
              choices: [
                "cold to hot",
                "hot to cold",
                "high pressure to low pressure",
                "low pressure to high pressure"
              ],
              correctIndex: 1
            },
            {
              id: "l2_assess_4",
              question: "Which of the following shows increasing entropy?",
              choices: [
                "Ice melting",
                "Water freezing spontaneously in warm air",
                "Cold objects heating hot objects",
                "Gas gathering into one corner"
              ],
              correctIndex: 0
            },
            {
              id: "l2_assess_5",
              question: "Which device requires work to transfer heat from cold to hot?",
              choices: [
                "fan",
                "refrigerator",
                "spoon",
                "table"
              ],
              correctIndex: 1
            },
            {
              id: "l2_assess_6",
              question: "When hot soup cools down, the entropy of the system:",
              choices: [
                "decreases",
                "increases",
                "disappears",
                "becomes negative"
              ],
              correctIndex: 1
            },
            {
              id: "l2_assess_7",
              question: "The Second Law explains why engines:",
              choices: [
                "are perfectly efficient",
                "cannot reach 100% efficiency",
                "do not produce heat",
                "create energy"
              ],
              correctIndex: 1
            },
            {
              id: "l2_assess_8",
              question: "Which example shows natural heat transfer?",
              choices: [
                "cold ice heating hot coffee",
                "hot coffee warming surrounding air",
                "ice forming in boiling water",
                "cold air heating a stove"
              ],
              correctIndex: 1
            },
            {
              id: "l2_assess_9",
              question: "When two objects at different temperatures touch, they eventually reach:",
              choices: [
                "energy loss",
                "thermal equilibrium",
                "zero energy",
                "pressure balance"
              ],
              correctIndex: 1
            },
            {
              id: "l2_assess_10",
              question: "Which concept is most closely related to the Second Law of Thermodynamics?",
              choices: [
                "velocity",
                "entropy",
                "density",
                "acceleration"
              ],
              correctIndex: 1
            }
          ]
        }
      }
    }
  }
};