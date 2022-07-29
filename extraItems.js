export default {
    "pre": {
        "add": {

        },

        "edit": {
            "cards": [
                {
                    "where": {"name": "Darkling Trio+"},
                    "to": {"name": "Darkling Duo+", "imgPath": "docs/export/downfall/card-images/Colorless-DarklingTrioPlus"}
                }
            ]
        }
    },

    "post": {
        "add": {
            "bosss": [
                {
                    "name": "Ironclad",
                    "act": 1,
                    "buff": ["Synchronize", "Whenever Ironclad generates a Status card, a duplicate is added into your discard pile."],
                    "cards": ["Bash", "Flawed", "Doubt", "Reckless Charge", "Wild Strike(+)", "Defend", "Power Through", "Second Wind", "Seeing Red", "Immolate", "Icky", "True Grit+", "Thunderclap+", "Feel No Pain"],
                    "relics": ["Art of War", "Champion's Belt", "Orichalcum (A19)"]
                },
                
                {
                    "name": "Ironclad",
                    "act": 2,
                    "buff": ["Feeding Frenzy", "Ironclad's Reaper foes not Exhaust and targets ALL Mushrooms. When Ironclad kills a Mushroom, he gains 1 Strength."],
                    "cards": ["Twin Strike", "Feed", "Clothesline", "Fungus Among Us", "Ghostly Armor+", "Hemokinesis", "Reaper", "Defend", "Haunted", "Swift Strike", "Heavy Blade", "Clumsy", "Bloodletting", "Headbutt", "Flame Barrier+", "Inflame(+)", "Strike"],
                    "customCards": [["Fungus Among Us", "Kill all Mushrooms. Heal HP equal to their remaining HP. Summon two Mushrooms."]],
                    "relics": ["Red Skull", "Magic Flower", "Vajra", "Du-Vu Doll (A19)"]
                },
                
                {
                    "name": "Ironclad",
                    "act": 3,
                    "buff": ["Bastion", "Ironclad begins the fight with a Fortification, which will grant him 10 block each turn. When the Fortification has been destroyed, Ironclad loses Barricade, but gains 5 Strength at the start of each turn."],
                    "cards": ["Feel No Pain", "Impervious", "Intimidate", "Flame Barrier(+)", "Body Slam", "Clumsy", "Entrench", "Metallicize", "Decay", "Power Through", "Second Wind", "Ghostly Armor"],
                    "relics": ["Odd Mushroom", "Torii", "Cursed Key", "Horn Cleat", "Self-Forming Clay (A19)"]
                },
                
                {
                    "name": "Silent",
                    "act": 1,
                    "buff": ["Warning: Highly Toxic", "Poison is blockable and deals damage at end of turn. Receive an Antidote at the start of combat."],
                    "cards": ["Crippling Cloud", "Survivor", "Burst", "Poisoned Stab", "Dodge and Roll", "Strike", "Bane(+)", "Defend", "Deflect", "Footwork", "Noxious Fumes", "Deadly Poison"],
                    "customCards": [["Antidote", "Lose all Poison."]],
                    "relics": ["Horn Cleat", "Twisted Funnel", "Lantern (A19)"]
                },
                
                {
                    "name": "Silent",
                    "act": 2,
                    "buff": ["Seeing Double", "At the start of each turn, a mirror image of Silent will hide her real location. Attacking silent or the mirror removes it from combat for the turn."],
                    "cards": ["After Image+", "Backstab", "Doppelganger+", "Nightmare", "Deflect(+)", "J.A.X.+", "Dagger Spray", "Decay", "Outmaneuver", "Flying Knee", "Blur", "Footwork", "Leg Sweep", "Riddle with Holes"],
                    "relics": ["Paper Krane", "Anchor", "Bag of Marbles", "Oddly Smooth Stone (A19)"]
                },
                
                {
                    "name": "Silent",
                    "act": 3,
                    "buff": ["Bag of Knives", "The first time you play a card that costs 2 or more each turn, Silent gains 2 Shivs."],
                    "cards": ["Predator", "Flying Knee", "Burst", "Flechettes", "Leg Sweep", "Cloak and Dagger", "Neutralize", "Blur", "Endless Agony", "Finisher+", "Defend", "Blade Dance -> Shiv", "Sucker Punch", "Dagger Spray", "Piercing Wail", "After Image", "Dash"],
                    "relics": ["Mummified Hand", "Fusion Hammer", "Shuriken", "Ornamental Fan", "Kunai (A19)"]
                },
                
                {
                    "name": "Defect",
                    "act": 1,
                    "buff": ["Energy Thief", "Whenever Defect generates a Void, it goes to the top of your draw pile."],
                    "cards": ["Buffer", "Doom and Gloom(+)", "Shame", "Steam Barrier", "Defend", "Aged", "Turbo+", "Sunder", "Defend", "Strike", "Core Surge", "Equilibrium"],
                    "relics": ["Clockwork souvenir", "Fossilized Helix", "Symbiotic Virus (A19)"]
                },
                
                {
                    "name": "Defect",
                    "act": 2,
                    "buff": ["Ancient Construct", "Begins the fight with 2 Bronze Orb minions. Gains 1 Artifact at the end of its turn if it did not already have Artifact."],
                    "cards": ["Boot Sequence", "Claw", "Machine Learning+", "Leap", "Cold Snap+", "Panic Button", "Strike", "Reprogram", "Swift Strike", "Rebound", "Charge Battery", "Genetic Algorithm+", "Shame", "Hyperbeam(+)", "Flawed", "Defend", "Clumsy"],
                    "relics": ["Turnip", "Red Mask", "Kunai", "Ginger (A19)"]
                },
                
                {
                    "name": "Defect",
                    "act": 3,
                    "buff": ["Unbiased Cognision", "Whenever you play a Power card, Defect gains 1 Focus."],
                    "cards": ["Rainbow", "Reinforced Body", "Charge Battery", "Zap+", "Dualcast", "Multi-Cast", "Cold Snap", "Barrage+", "Leap", "Storm", "Defragment(+)", "Blind"],
                    "relics": ["Coffee Dripper", "Fossilized Helix", "Lantern", "Data Disk", "Art of War (A19)"]
                },
                
                {
                    "name": "Watcher",
                    "act": 1,
                    "buff": ["Unbridled Rage", "At the end of her turn, if Watcher is at or below 50% HP, she enters Wrath. Watcher's Wrath increases damage dealt and received by 50% instead of 100%."],
                    "cards": ["Wallop(+)", "Halt", "Defend+", "Clumsy", "Sands of Time", "Talk to the Hand", "Crush Joints", "Panacea", "Fasting", "Regret", "Parasite"],
                    "relics": ["Bag of Preparation", "Cloak Clasp", "Mercury Hourglass (A19)"]
                },
                
                {
                    "name": "Watcher",
                    "act": 2,
                    "buff": ["Blasphemer's Demise", "When Watcher loses 150 more HP, apply -4 Strength to her when she next enters Divinity or plays Ragnarok."],
                    "cards": ["Like Water", "Defend", "Ragnarok+", "Strike", "Follow-Up", "Wave of the Hand", "Defend+", "Wallop+", "Blasphemy+", "Flying Sleeves+", "Wish(+) -> Become Almighty(+)", "Tranquility+", "Vigilance", "Empty Body", "Wish -> Live Forever", "Consecrate+"],
                    "relics": ["Incense Burner", "Teardrop Locket", "Oddly Smooth Stone", "Enchiridion (A19)"]
                },
                
                {
                    "name": "Watcher",
                    "act": 3,
                    "buff": [" Fleeting Faith", "Watcher gains 1 Mantra whenever you play a card. Watcher loses 5 Mantra at the start of her turn. Watcher does not exit Divinity at the end of her turn."],
                    "cards": ["Wish -> Live Forever", "Good Instincts", "Shame", "Wave of the Hand", "Swivel", "Blind", "Signature Move", "Conjure Blade -> Expunger", "Sanctity", "Protect+", "Empty Fist(+)", "Normality", "Strike", "Devotion"],
                    "relics": ["Velvet Choker", "Torii", "Captain's Wheel", "Thread and Needle", "Damaru (A19)"]
                },
                
                {
                    "name": "Hermit",
                    "act": 1,
                    "buff": ["Deadly Focus ", "Hermit has Concentration, which adds special Dead On effects to his cards. Dealing 10 unblocked damage to him breaks the concentration, causing his cards to lose their Dead On effects."],
                    "cards": ["Headshot", "Defend", "Injury", "Itchy Trigger", "Strike", "Ghostly Presence", "Dive(+)", "Lone Wolf", "Roughhouse", "Deadeye"],
                    "relics": ["Calipers", "Oddly Smooth Stone", "The Abacus", "Orichalcum (A19)"]
                },
                
                {
                    "name": "Hermit",
                    "act": 2,
                    "buff": ["Wheel of Fortune", "Whenever you strike Hermit with an Attack, its leftmost card is discarded and it draws a card. Every 6 times this happens, Hermit gains 1 Strength."],
                    "cards": ["Showdown+", "Strike+", "Strike", "Defend", "Desperado", "Wide Open+", "Hole Up", "Flash Powder(+)", "Itchy Trigger", "Hand of Greed", "Virtue+", "Maintenance+", "Necronomicurse"],
                    "relics": ["Necronomicon", "Philosopher's Stone", "Pen Nib"]
                },
                
                {
                    "name": "Hermit",
                    "act": 3,
                    "buff": ["Doomsday", "At the start of your turn, gain an Impending Doom with Retain."],
                    "cards": ["Covet+", "Defend", "Pain", "Clumsy", "Spite", "Misfire", "Glare", "Ghostly Presence", "Master of Strategy", "Bandage Up", "Lone Wolf", "Wide Open", "Malice", "Spray n' Pray", "Enervate", "Low Profile", "Doubt", "Purgatory", "Grudge"],
                    "relics": ["Charred Glove", "Gremlin Visage", "Art of War", "Omamori", "Calling Bell", "Orichalcum (A19)"]
                }
            ],
        
            "events": [
                {
                    "name": "Mind Bloom",
                    "acts": [3],
                    "mod": "downfall",
                    "options": [
                        ["I am an Echo", null, "r/Fight yourself. g/Obtain a Rare Relic."],
                        ["I am Complete", "requires all keys broken", "g/Upgrade all Cards. r/Lose Heart Blessings n/and r/10 Max HP."],
                        ["I am Gorged", "before chest", "g/Gain 999 Souls r/Cursed - 2 Normality."],
                        ["I am Healthy", "after chest", "g/Heal to full HP. r/Cursed - Doubt."]
                    ]
                },
        
                {
                    "name": "Soul Shrine",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Pray", null, "g/Gain 100 a/(50) Gold."],
                        ["Desecrate", null, "g/Gain 275 Gold. r/Become Cursed - Regret"],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "The Woman in Blue",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Punch", null, "r/Fight. g/Gain a Potion Relic and 3 Potions."],
                        ["Leave", null, "a/Take damage equal to 5% of your max HP."]
                    ]
                },
        
                {
                    "name": "The Cursed Fountain",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Bottle", "requires 1+ curse", "g/Gain Cursed Liquid Potion."],
                        ["Consume", "requires 2+ curses", "g/Gain 75 y/Souls."],
                        ["Drink", "requires 3+ curses", "g/Heal to full HP."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "We Meet Again!",
                    "acts": [1, 2, 3],
                    "mod": "downfall",
                    "options": [
                        ["r/Lose (relic chosen at random)", "requires 1+ non-starter non-boss non-event relic", "g/Gain 3 Potions."],
                        ["r/Lose (relic chosen at random)", "requires 2+ non-starter non-boss non-event relics", "g/Gain 150 a/(75) y/Souls."],
                        ["r/Lose (relic chosen at random)", "requires 3+ non-starter non-boss non-event relics", "g/Gain a y/Rare g/Card."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Designer In-Spire",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Punch", null, "r/Take damage equal to 8% a/(12%) of your max HP."],
                        ["Adjustments", "punch first", "g/Upgrade 1-2 random cards."],
                        ["Clean Up", "punch first", "g/Transform 1-2 random cards."],
                        ["Full Service", "punch first", "g/Remove a card and upgrade a random card."],
                        ["Ignore", null, "Leave."]
                    ]
                },
        
                {
                    "name": "Shining Light",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Enter", null, "g/Upgrade 3 random cards. r/Become Cursed - Flawed."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "World of Goop",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Full Harvest", null, "g/Gain 450 a/(300) y/Souls. r/Become Cursed Thrice - Icky."],
                        ["Drain", null, "g/Gain 300 a/(200) y/Souls. r/Become Cursed Twice - Icky."],
                        ["Sap", null, "g/Gain 150 a/(100) y/Souls. r/Become Cursed - Icky."]
                    ]
                },
        
                {
                    "name": "Wing Statue",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Destroy", null, "r/Lose 11 Max HP. g/Gain Sharpened Fragment."],
                        ["Collect", null, "g/Gain Broken Wing Statue."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Golden Idol",
                    "acts": [1],
                    "mod": "downfall",
                    "options": [
                        ["Set Trap", "last time you saw this event in another run, you harvested", "r/Lose a Strike."],
                        ["Harvest", "last time you saw this event in another run, you set a trap", "g/Gain 100 y/Souls."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "The Cleric",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Punch", null, "g/Gain 100 a/(50) y/Souls"],
                        ["Intimidate", null, "g/Remove a card from your deck."]
                    ]
                },
        
                {
                    "name": "Cursed Tome",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Take", null, "Obtain g/Enchiridionn/, g/Nilry's Codexn/, or g/Necronomicon. r/Lose 16 a/(21) r/HP."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Knowing Skull",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["You.", null, "g/Obtain Knowing Skull. r/Lose 7 a/(14) r/HP."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Pleading Vagrant",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Punch", null, "g/Gain 85 Souls. r/Lose 11 a/(16) r/HP."],
                        ["Rob", null, "g/Obtain a Relic. r/Become Cursed - Pride."]
                    ]
                },
        
                {
                    "name": "Old Beggar",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Continue", "cleric event not seen yet", "g/Begin cleric event"],
                        ["Fight", " intimidate option chosen in cleric event", "r/Fight 2 centurions. n/Choose: g/Gain 200 a/(100) y/Souls n/or g/Remove 2 cards from your deck."],
                        ["Punch", "punch option chosen in cleric event", "g/Gain 100 a/(50) y/Souls. r/Become Cursed - Pride"],
                        ["Leave", "punch option chosen in cleric event", ""]
                    ]
                },
        
                {
                    "name": "The Nest",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Return Statue", "requires Broken Wing Statue", "r/Lose Broken Wing Statue. g/Gain n/Ritual Dagger+ g/with 20 damage n/and a g/Cultist Potion."],
                        ["Steal", null, "g/Obtain n/Ritual Dagger. r/Lose 6 HP."],
                        ["Accept", null, "g/Gain Cultist Potion."],
                        ["Continue", null, ""]
                    ]
                },
        
                {
                    "name": "The Colosseum",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Defend Title", "champ only", "r/Fight n/Black Knight. g/Gain many rewards."],
                        ["Challenge", null, "r/Fight n/Arena Champions. g/Gain many rewards."],
                        ["Participate", null, "r/Fight n/Captive Hero. g/Gain many rewards."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Tomb of Lord Red Mask",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Don the Red Mask", "requires red mask and bandit contract", "g/Upgrade Bandit Contract."],
                        ["Bash", null, "r/Lose (attack chosen at random). g/Obtain Red Mask."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Winding Halls",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Left", null, "g/Explore an Event."],
                        ["Right", null, "g/Search the Treasury for a Relic."],
                        ["Straight", null, "g/Hunt down the Merchant."]
                    ]
                },
        
                {
                    "name": "The Joust",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Left", null, "r/50%: Lose HP equal to 30% of your max HP. g/50%: Gain 200 Souls."],
                        ["Right", null, "r/25%: Lose HP equal to 15% of your max HP. g/75%: Gain 100 Souls."]
                    ]
                },
        
                {
                    "name": "Drone Factory",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "The_bronze_automaton",
                    "options": [
                        ["Fight Spiker", null, "g/Gain Spike n/as a combat reward."],
                        ["Fight Repulsor", null, "g/Gain Dazing Pulse n/as a combat reward."],
                        ["Fight Exploder", null, "g/Gain Explode n/as a combat reward."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Ancient Factory",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "The_bronze_automaton",
                    "options": [
                        ["Fight Donu Prototype", null, "g/Gain Proto-Beam."],
                        ["Fight Deca Prototype", null, "g/Gain Proto-Shield."],
                        ["Fight Both", null, "g/Gain Both Cards."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Grim Forge",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "The_bronze_automaton",
                    "options": [
                        ["Craft", null, "g/Gain Bottled Code. r/Lose 10 Max HP."],
                        ["Reforge", "requires a rare card", "r/Remove n/a y/Rare n/Card. g/Gain 10 Max HP and Heal to full."],
                        ["Transmute", null, "r/Remove n/a Card. Gain a random g/Card with Encode."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Tome of Technique",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "The_champ_gray",
                    "options": [
                        ["Read", null, "Choose an Attack to gain y/'trigger Skill Bonus.' r/Lose 5 -> 10 -> 20 r/HP n/-> r/Cursed - Pride"],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Gymnasium",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "The_champ_gray",
                    "options": [
                        ["Cardio", null, "g/Gain 10 Max HP."],
                        ["Spar", null, "Choose a non-Finisher card to gain 'Enter (Chosen) Stance'."],
                        ["Lift", null, "g/Gain Inner Strength."]
                    ]
                },
        
                {
                    "name": "Minor League Arena",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Fight Centurion & Mystic", null, "g/Gain Cloak Clasp"],
                        ["Fight Gremlin Nob", null, "g/Gain Champion Belt"],
                        ["Fight Slaver Duo", null, "g/Gain Wrist Blade"],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Suspicious Merchant",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Buy", null, "r/Lose 10 a/(30) r/Gold. g/Obtain 1 random Colorless Card."],
                        ["Buy", null, "r/Lose 50 a/(70) r/Gold. g/Obtain 2 random Colorless Cards."],
                        ["Buy", null, "r/Lose 90 a/(110) r/Gold. g/Obtain 3 random Colorless Cards."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Gem Mine",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "Guardian",
                    "options": [
                        ["Rob", null, "r/Fight Gremlins. g/Gain Pick of Rhapsody."],
                        ["Mine with Pick", "have pick of rhapsody with at least 1 charge", "g/Gain random Gem. r/Lose Pick charge."],
                        ["Dig with Claws", null, "g/Gain random Gem. r/Lose ", " r/HP."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Quantum Chamber",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "Guardian",
                    "options": [
                        ["Use", null, "g/Gain Quantum Chamber. r/Become Cursed - Aged"],
                        ["Smash", null, "g/Gain max hp equal to 15% a/(10%) g/of your current max HP. r/Become Cursed - Pain"],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Grim Forge",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "Guardian",
                    "options": [
                        ["Dismantle", "requires card with a gem installed.", "r/Remove n/Socketed Card. Gain its g/Gems."],
                        ["Pry", "requires card with a gem installed.", "r/Destroy n/all g/Gems n/in a Socketed Card."],
                        ["Transmute", null, "r/Remove n/a Card. Gain a random g/Gem."],
                        ["Enhance", "requires a gem and an open socket.", "Add a g/Gem n/to a g/Socket."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Wandering Specter",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Left Box", null, "g/Obtain a Du-Vu Doll or Darkstone Periapt. r/Cursed Twice - Haunted."],
                        ["Right Box", null, "g/Obtain r/Extra g/Cursed Key n/or r/Extra g/Cursed Bell."],
                        ["Chase Away", "no blue candle", "g/Obtain Blue Candle. r/Lose 5 HP."],
                        ["Chase Away", "have blue candle", "Leave."],
                        ["Trade for Power", "choose a box", "g/Gain n/a g/random y/Rare g/card. r/Become Cursed - Random."],
                        ["Trade for Life", "choose a box", "g/Gain 5 Max HP. r/Become Cursed - Random."],
                        ["Trade for Souls", "choose a box", "g/Gain 100 Souls. r/Become Cursed - Random."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Seal Chamber",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "Hexa_ghost_purple",
                    "options": [
                        ["Offer", null, "r/Lose n/7 HP. g/Gain First Seal."],
                        ["Offer", null, "r/Lose n/10 y/Souls. g/Gain Second Seal."],
                        ["Offer", null, "r/Lose n/(common card chosen at random). g/Gain Third Seal."],
                        ["Offer", null, "r/Lose n/(potion chosen at random). g/Gain Fourth Seal."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Council of Ghosts",
                    "acts": [2],
                    "mod": "downfall",
                    "character": "Hexa_ghost_purple",
                    "options": [
                        ["Accept", null, "r/Lose 50% of your Max HP. n/Unlock Study and Learn options."],
                        ["Study", null, "r/Lose all Strikes. g/Gain 3 Council's Justice."],
                        ["Learn", null, "r/Lose all Defends. g/Gain 3 Apparition."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "World of Goop",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "Slimebound",
                    "options": [
                        ["Gather Souls", null, "g/Gain 75 Souls."],
                        ["Recruit", null, "r/Lose 75 Souls. g/Gain y/Greed Ooze."]
                    ]
                },
        
                {
                    "name": "The Art of Slime War",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Read", null, "g/Remove all n/Strikes. g/Receive 3 Upgraded n/Tackles."],
                        ["Take", null, "g/Obtain Consult Playbook. r/Trigger a trap."],
                        ["Leave", null, ""],
                        ["Dive", "trap triggered", "r/Become Cursed - Icky."],
                        ["Be Patient", "trap triggered", "r/Take 35% a/(45%) r/of your max HP as damage."],
                        ["Grab and Run", "trap triggered", "r/Lose 10% a/(15%) r/of your Max HP."]
                    ]
                },
        
                {
                    "name": "Darklings",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "Slimebound",
                    "options": [
                        ["Fight", null, "r/Fight Darklings. g/Gain card reward."],
                        ["Recruit", "requires a rare card", "r/Lose n/(rare card chosen at random) g/Obtain Darklings."]
                    ]
                },
        
                {
                    "name": "Mystical Octahedron",
                    "acts": ["?"],
                    "mod": "downfall",
                    "character": "Snecko_cyan",
                    "options": [
                        ["Shatter", null, "r/Lose 10 a/(15) r/HP. g/Gain 5 Unidentified Cards"],
                        ["Take", "requires a card that uses a randomly chosen number", "g/Gain Mystical Octahedron. r/Cursed - Pain."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Suspicious House",
                    "acts": ["?"],
                    "mod": "downfall",
                    "options": [
                        ["Rescue", null, "g/Gain Young Snecko. r/Become Cursed - Bewildered."],
                        ["Leave", null, ""]
                    ]
                },
        
                
                {
                    "name": "Ominous Forge",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Tinker", "automaton only", "g/Upgrade 3 Random Cards with Encode."],
                        ["Tinker", "guardian only - have a card with sockets", "g/Add a socket to any socketed card."],
                        ["Forge", null, "g/Upgrade a card in your deck."],
                        ["Rummage", null, "g/Obtain a special Relic. r/Become Cursed - Pain."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Pleading Vagrant",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Offer Gold", "requires 85 gold", "y/85 Gold: g/Obtain a Relic."],
                        ["Rob", null, "g/Obtain a Relic. r/Become Cursed - Shame."],
                        ["Leave", "", ""]
                    ]
                },
        
                {
                    "name": "Ancient Writing",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Elegance", null, "g/Remove a card from your deck."],
                        ["Simplicity", null, "g/Upgrade all Strikes and Defends."],
                        ["Unification", "automaton only", "All g/Strikes n/and g/Defends n/gain g/Encode."],
                        ["Intuition", "champ only", "g/Add y/'trigger Skill Bonus.' n/to all g/Strikes n/and g/Defends."],
                        ["Caprice", "gremlins only", "g/Replace n/all g/Strikes n/and g/Defends n/with g/Shivs n/and g/Wards."],
                        ["Endurance", "guardian only", "g/Add Brace 2 n/to all g/Strikes n/and g/Defends."],
                        ["Wistfulness", "hexaghost only", "g/Add Ethereal n/to all g/Strikes n/and g/Defends."],
                        ["Inspiration", "slime boss only", "g/Add Command n/to all g/Strikes n/and g/Defends."],
                        ["Improvisation", "snecko only", "g/Replace n/all g/Strikes n/and g/Defends n/with random g/Unidentified n/cards."]
                    ]
                },
        
                {
                    "name": "Old Beggar",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Offer Gold", "requires 75 gold", "y/75 Gold: g/Remove a card from your deck."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Big Fish",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Banana", null, "g/Heal HP equal to 33% of your max HP."],
                        ["Donut", null, "g/Max HP +5."],
                        ["Box", null, "g/Obtain a Relic. r/Become Cursed - Regret."]
                    ]
                },
        
                {
                    "name": "Bonfire Spirits",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Offer", null, "Receive a reward based on the offer."],
                        ["Donate", "downfall only, requires 150 souls", "r/Lose 150 Souls. g/Gain 10 Max HP."]
                    ]
                },
        
                {
                    "name": "Dead Adventurer",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Soul Harvest", null, "g/Find Loot. r/25% -> 50% -> 75% a/(35% -> 60% -> 85%)r/: monster returns."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Augmenter",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Test J.A.X.", null, "g/Get JAXXED."],
                        ["Become Test Subject", null, "g/Transform 2 cards."],
                        ["Ingest Mutagens", null, "g/Gain Mutagenic Strength."],
                        ["Punch", "downfall only", "r/Fight. g/Take Everything."]
                    ]
                },
        
                {
                    "name": "Duplicator",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Desecrate", "downfall only", "g/Duplicate 2 cards. r/Cursed - Random."],
                        ["Pray", null, "g/Duplicate a card in your deck."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Falling",
                    "acts": [3],
                    "mod": "",
                    "options": [
                        ["Land", null, "r/Lose (random skill)."],
                        ["Channel", null, "r/Lose(random power) n/"],
                        ["Strike", null, "r/Lose (random attack)n/"],
                        ["Float", "hexaghost only", "r/Lose nothing..."]
                    ]
                },
        
                {
                    "name": "Forgotten Altar",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Offer", "requires golden idol", "g/Obtain a special Relic. r/Lose Golden Idol."],
                        ["Sacrifice", null, "g/Gain 5 max HP. r/Lose HP equal to 25% a/(35%) r/of your max HP."],
                        ["Desecrate", "standard only", "r/Become Cursed - Decay."],
                        ["Offer Souls", "downfall only, requires 50 souls", "r/Lose 50 Souls. g/Heal HP equal to 35% a/(45%) g/of your max HP."],
                        ["Leave", "downfall only", ""]
                    ]
                },
        
                {
                    "name": "The Divine Fountain",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Drink", null, "g/Remove all Curses from your deck."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Council of Ghosts",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Offer", "downfall only, requires 150 souls", "r/Lose 150 Souls. g/Receive n/Apparition."],
                        ["Accept", null, "g/Receive 5 a/(3) n/Apparition. r/Lose 50% of your max HP."],
                        ["Refuse", null, ""]
                    ]
                },
        
                {
                    "name": "Golden Idol",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Take", null, "g/Obtain Golden Idol. r/Trigger a trap."],
                        ["Leave", null, ""],
                        ["Outrun", "trap triggered", "r/Become Cursed - Injury."],
                        ["Smash", "trap triggered", "r/Take damage equal to 25% a/(35%) r/of your max HP."],
                        ["Hide", "trap triggered", "r/Lose 8% a/(10%) r/Max HP."]
                    ]
                },
        
                {
                    "name": "Golden Shrine",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Pray", null, "g/Gain 100 a/(50) g/Gold."],
                        ["Desecrate", null, "g/Gain 275 Gold. r/Become Cursed - Regret."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Wing Statue",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Pray", null, "g/Remove a card from your deck. r/Lose 7 HP."],
                        ["Destroy", "requires card with 10 or more damage", "g/Gain 50-80 Gold."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Knowing Skull",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["A Pick Me Up?", null, "g/Get a Potion. r/Lose X HP, where X = (10% of your max hp + number of times an option has been clicked)."],
                        ["Riches?", null, "g/Gain 90 g/Gold. r/Lose X HP."],
                        ["Success?", null, "g/Get a Colorless Card. r/Lose X HP."],
                        ["How do I leave?", null, "Leave. r/Lose X HP."]
                    ]
                },
        
                {
                    "name": "Lab",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Search", null, "g/Find 3 a/(2) g/random Potions!"]
                    ]
                },
        
                {
                    "name": "The Ssssserpent",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Agree", "not snecko", "g/Gain 175 a/(150) y/Souls. r/Become Cursed - Doubt."],
                        ["Agree", "snecko only", "g/Gain a random Relic. r/Become Cursed - Bewildered."],
                        ["Disagree", null, ""]
                    ]
                },
        
                {
                    "name": "Living Wall",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Forget", null, "g/Remove a card from your deck."],
                        ["Change", null, "g/Transform a card in your deck."],
                        ["Grow", null, "g/Upgrade a card in your deck."],
                        ["Punch", "downfall only", "r/Fight. g/Use all 3 Heads."]
                    ]
                },
        
                {
                    "name": "Masked Bandits",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["r/Lose (relic chosen at random)", "downfall only - requires a non-starter relic", "g/Gain Bandit Contract."],
                        ["Pay", "standard only", "r/Lose ALL n/of your y/Gold."],
                        ["Fight!", null, "r/Fight. g/Gain Red Mask."]
                    ]
                },
        
                {
                    "name": "Match and Keep!",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Play", null, "Play Match and Keep!"],
                        ["Punch", "downfall only", "r/Fight. g/Gain Gremlin Sack."]
                    ]
                },
        
                {
                    "name": "Mushrooms",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Stomp", null, "r/Anger the Mushrooms. g/Gain Odd Mushroom."],
                        ["Eat", null, "g/Heal 25% HP. r/Become Cursed - Parasite."]
                    ]
                },
        
                {
                    "name": "Mysterious Sphere",
                    "acts": [3],
                    "mod": "",
                    "options": [
                        ["Open Sphere", null, "r/Fight 2 Orb Walkers. g/Reward: Rare Relic."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "N'loth",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Offer: (relic chosen at random)", null, "r/Lose this relic. Obtain a special relic"],
                        ["Offer: (relic chosen at random)", null, "r/Lose this relic. Obtain a special relic"],
                        ["Punch", "downfall only", "g/Gain Random Relic. r/Become Cursed - Pain."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Purifier",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Desecrate", "downfall only", "g/Remove 3 cards. r/Cursed - Random."],
                        ["Smash", "guardian only, instead of desecrate", "g/Gain 2 Random Gems."],
                        ["Pray", null, "g/Remove a card from your deck."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Scrap Ooze",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Recruit", "slime boss only", "r/Lose (common or uncommon relic chosen at random). Gain g/Scrap Ooze."],
                        ["Reach Inside", null, "r/Lose 3 -> 4 -> 5 a/(5 -> 6 -> 7) r/HP. g/25% -> 35% -> 45%: g/Find a Relic."],
                        ["Reach Carefully", "gremlins only - instead of reach inside", "r/10% -> 15% -> 20% a/(20% -> 25% -> 30%)r/: Become Cursed - Scatterbrained. g/25% -> 35% -> 45%: g/Find a Relic."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Secret Portal",
                    "acts": [3],
                    "mod": "",
                    "options": [
                        ["Enter the Portal", "standard only", "IMMEDIATELY travel to the boss."],
                        ["Take Stone", "downfall only", "g/Gain Teleport Stone."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Sensory Stone",
                    "acts": [3],
                    "mod": "",
                    "options": [
                        ["Recall", "standard only", "g/Add 1/2/3 Colorless card(s) to your deck. r/Lose 0/5/10 HP."],
                        ["Recall", "downfall only", "g/Add 1/2/3 Boss card(s) to your deck. r/Lose 0/5/10 HP."]
                    ]
                },
        
                {
                    "name": "Shining Light",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Enter", null, "g/Upgrade 2 random cards. r/Lose HP equal to 20% a/(30%) r/of your max HP."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "The Cleric",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Heal", null, "y/35 Gold: g/Heal 25% of your max HP."],
                        ["Purify", null, "y/50 a/(75) y/Gold: g/Remove a card from your deck."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "The Joust",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Murderer", null, "y/Bet 50 Gold n/- g/70%: win 250 Gold."],
                        ["Owner", null, "y/Bet 50 Gold n/- g/30%: win 100 Gold."]
                    ]
                },
        
                {
                    "name": "The Library",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Read", null, "g/Choose 1 of 20 cards to add to your deck."],
                        ["Sleep", null, "g/Heal 33% a/(20%) g/of your max HP."],
                        ["Seek", "champ only", "Locate a g/Book n/on Fighting. (Will be g/Berserker's guiden/, g/Defensive Thesisn/, g/Gladiators Manualn/, or g/Dolphin's Style Guiden/)"]
                    ]
                },
        
                {
                    "name": "The Mausoleum",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Feast", "downfall only", "g/Gain 200 Souls. r/Become Cursed - Haunted."],
                        ["Open Coffin", "downfall only", "g/Obtain a Relic. r/50% a/(100%)r/: Become Cursed - Haunted."],
                        ["Open Coffin", "standard", "g/Obtain a Relic. r/50% a/(100%)r/: Become Cursed - Writhe."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "The Moai Head",
                    "acts": [3],
                    "mod": "",
                    "options": [
                        ["Jump Inside", null, "g/Heal to full HP. r/Lose 12.5% a/(18%) r/of your max HP."],
                        ["Offer Souls", "downfall only, requires 333 souls", "r/Lose 333 Souls. g/Gain max HP equal to 12.5% a/(18%) g/of your current max HP n/and g/Heal to full."],
                        ["Offer Golden Idol", "requires golden idol", "g/Gain 333 Gold. r/Lose Golden Idol."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "The Woman in Blue",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Buy 1 Potion", null, "y/20 Gold."],
                        ["Buy 2 Potions", null, "y/30 Gold."],
                        ["Buy 3 Potions", null, "y/40 Gold."],
                        ["Leave", null, "a/Take damage equal to 5% of your max HP."]
                    ]
                },
        
                {
                    "name": "Tomb of Lord Red Mask",
                    "acts": [3],
                    "mod": "",
                    "options": [
                        ["Don the Red Mask", "requires red mask", "g/Gain 222 Gold."],
                        ["Offer", null, "r/Lose all Gold. g/Obtain a Relic."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Transmogrifier",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Desecrate", "downfall only", "g/Transform 3 cards. r/Cursed - Random."],
                        ["Smash", "guardian only, instead of desecrate", "g/Gain 2 Random Gems."],
                        ["Pray", null, "g/Transform a card."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Upgrade Shrine",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Desecrate", "downfall only", "g/Upgrade 2 cards. r/Cursed - Random."],
                        ["Smash", "guardian only, instead of desecrate", "g/Gain 2 Random Gems."],
                        ["Pray", null, "g/Upgrade a card."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "Vampires(?)",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Offer: Blood Vial", "requires blood vial", "g/Remove all n/Strikes. g/Receive 5 n/Bites."],
                        ["Accept", null, "g/Remove all n/Strikes. g/Receive 5 n/Bites. r/Lose 30% of your Max HP."],
                        ["Refuse", null, ""]
                    ]
                },
        
                {
                    "name": "Wheel of Change",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Prize", null, "g/Obtain a Relic n/or g/Gain (act number x 100) gold n/or g/Remove a card from your deck n/or g/Heal to full health n/or r/Lose HP equal to 10% a/(15%) r/of your Max HP n/or r/Curse - Decay"],
                        ["Punch", "downfall only", "r/Fight. g/Gain Wheel of Change."],
                        ["PREEMPTIVE STRIKE!", "as gremlins, get the \"lose hp\" option", "g/Gain a random relic and 300 gold."]
                    ]
                },
        
                {
                    "name": "Winding Halls",
                    "acts": [3],
                    "mod": "",
                    "options": [
                        ["Embrace Madness", null, "g/Receive 2 n/Madness. r/Lose HP equal to 12.5% a/(18%) r/of your max HP."],
                        ["Focus", null, "r/Become Cursed - Writhe. g/Heal 25% a/(20%) g/of max HP."],
                        ["Retrace Your Steps", null, "r/Lose 5% of your Max HP."]
                    ]
                },
        
                {
                    "name": "World of Goop",
                    "acts": [1],
                    "mod": "",
                    "options": [
                        ["Gather Gold", null, "g/Gain 75 Gold. r/Lose 11 HP."],
                        ["Leave It", null, "r/Lose 20-50 a/(35-75) r/Gold."]
                    ]
                },
        
                {
                    "name": "Mind Bloom",
                    "acts": [3],
                    "mod": "",
                    "options": [
                        ["I am War", null, "r/Fight a Boss from Act 1. g/Obtain a Rare Relic."],
                        ["I am Awake", null, "g/Upgrade all Cards. r/You can no longer heal."],
                        ["I am Rich", "before floor 41", "g/Gain 999 Gold. r/Cursed - 2 Normality."],
                        ["I am Healthy", "floor 41+", "g/Heal to full HP. r/Cursed - Doubt."]
                    ]
                },
        
                {
                    "name": "The Nest",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Smash and Grab", null, "g/Obtain 99 a/(50) y/Gold."],
                        ["Stay in Line", null, "g/Obtain n/Ritual Dagger. r/Lose 6 HP."]
                    ]
                },
        
                {
                    "name": "Face Trader",
                    "acts": [1, 2],
                    "mod": "",
                    "options": [
                        ["Punch", "downfall only", "r/Fight. g/Gain Coat of Many Faces."],
                        ["Touch", "standard only", "r/Lose HP equal to 10% of max HP, g/gain 75 a/(50) y/gold."],
                        ["Trade", null, "Gain g/Ssserpent Headn/, g/Face Of Clericn/, w/Cultist Headpiecen/, r/Gremlin Visagen/, or r/N'Loth's Hungry Facen/."],
                        ["Leave", null, ""]
                    ]
                },
        
                {
                    "name": "A Note For Yourself",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Take and Give", null, "g/Receive n/(last card stored) g/and Store a Card."],
                        ["Ignore", null, ""]
                    ]
                },
        
                {
                    "name": "We Meet Again!",
                    "acts": [1, 2, 3],
                    "mod": "",
                    "options": [
                        ["Give Potion", "requires potion", "r/Lose (potion chosen at random). g/Obtain a Relic."],
                        ["Give Gold", "requires 50 gpld", "r/Lose 50-150 gold. g/Obtain a Relic."],
                        ["Give Card", "requires non-starter non-curse card", "r/Lose n/(card chosen at random). g/Obtain a Relic."],
                        ["Attack", null, ""]
                    ]
                },
        
                {
                    "name": "Designer In-Spire",
                    "acts": [2, 3],
                    "mod": "",
                    "options": [
                        ["Adjustments", null, "r/Lose 40 a/(50) r/Gold. (chosen at random): g/Upgrade a card n/or g/Upgrade 2 random cards."],
                        ["Clean Up", null, "r/Lose 60 a/(75) r/Gold. g(chosen at random): g/Remove a card n/or g/Transform 2 cards."],
                        ["Full Service", null, "r/Lose 90 a/(110) r/Gold. g/Remove a card and upgrade a random card."],
                        ["Punch", null, "r/Lose 3 a/(5) r/HP."]
                    ]
                },
        
                {
                    "name": "The Colosseum",
                    "acts": [2],
                    "mod": "",
                    "options": [
                        ["Fight", "forced", "r/Fight Blue Slaver and Red Slaver. Gain no rewards."],
                        ["COWARDICE", null, "Escape."],
                        ["VICTORY", null, "A powerful fight with many rewards."]
                    ]
                }
            ],
        
            "potions": [
                {
                    "name": "Armorer's Tincture",
                    "rarity": "Uncommon",
                    "description": "Gain 4 Block each time you play a card this turn.",
                    "img": "/altered/img/potions/armorerstincture.png",
                    "mod": "downfall"
                },
                
                {
                    "name": "Brew of Sharpness",
                    "rarity": "Common",
                    "description": "Gain 25 :Counter.",
                    "img": "/altered/img/potions/brewofsharpness.png",
                    "mod": "downfall"
                },
                
                {
                    "name": "Molotov",
                    "rarity": "Common",
                    "description": "Apply 30 :Soulburn.",
                    "img": "/altered/img/potions/molotov.png",
                    "mod": "downfall"
                },
                
                {
                    "name": "Ooze-Infused Drink",
                    "rarity": "Rare",
                    "description": "Add 4 random 0-cost cards to your hand.",
                    "img": "/altered/img/potions/oozeinfuseddrink.png",
                    "mod": "downfall"
                },
                
                {
                    "name": "Pizazz Potion",
                    "rarity": "Common",
                    "description": "Gain 10 Vigor.",
                    "img": "/altered/img/potions/pizazz.png",
                    "mod": "downfall"
                },
                
                {
                    "name": "Spiked Energy Drink",
                    "rarity": "Common",
                    "description": ":Muddle the 2 highest-cost cards in your hand. Cards :Muddled this way cannot cost 3.",
                    "img": "/altered/img/potions/spikedenergydrink.png",
                    "mod": "downfall"
                },
                
                {
                    "name": "Vexing Draught",
                    "rarity": "Uncommon",
                    "description": "Gain 2 Strength and 2 Dexterity. Add two :Burn+ cards to your draw pile.",
                    "img": "/altered/img/potions/vexingdraught.png",
                    "mod": "downfall"
                },
                
                {
                    "name": "Boss Potion",
                    "rarity": "Uncommon",
                    "description": "Choose 1 of 3 random :Boss cards to add to your hand, it costs 0 this turn.",
                    "img": "/altered/img/potions/boss.png",
                    "mod": "downfall"
                },
                
                {
                    "name": "Cursed Fountain Liquid",
                    "rarity": "Event",
                    "description": "Apply 2 Weak, 2 Vulnerable, and reduce Strength by 2.",
                    "img": "/altered/img/potions/fountain.png",
                    "mod": "downfall"
                }
            ]
        },
    
        "edit": {
            "cards": [
                {
                    "where": {"name": "Gremlin Dance"},
                    "to": {"description": desc => desc.replace('Has a bonus effect based on which Gremlin you are.', 'If Sneaky: Draw 2 cards.\nIf Mad: Deals to ALL enemies.\nIf Shield: Gain 6 Block.\nIf Fat: Enemy loses 2 Strength this turn.\nIf Wizard: Gain 2 Wiz.')}
                },

                {
                    "where": {"name": "Darkling Duo"},
                    "to": {"name": "Darkling Duo (Trio)", "img": "/altered/img/cards/Colorless-DarklingDuo.png"}
                },

                {
                    "where": {"name": "Knowing Skull"},
                    "to": {"description": "Ethereal.\nChoose:\nSouls: Lose 3 HP. Gain 40 (50) Souls.\nSuccess: Lose 1 HP. Add a random (upgraded) Colorless card to your hand.\nA Pick Me Up: Lose 5 (2) HP. Gain a random Potion.\nExhaust."}
                },
    
                {
                    "where": {"name": "Searing Blow"},
                    "to": {"description": "Deal 12 (16 (21 (27 (34 (42 (51 (61 (72 (84 (97)))))))))) damage.\nCan be Upgraded any number of times."}
                },
    
                {
                    "where": {"name": "Dice Boulder"},
                    "to": {"description": "Deal 1 - 27 (7 - 30 (14 - 34 (22 - 39 (31 - 45 (41 - 52 (52 - 60 (64 - 69 (77 - 79 (91 - 90 (106 - 102)))))))))) damage.\nCan be Upgraded any number of times."}
                },

                {
                    "where": {"name": "Whiz"},
                    "to": {"description": desc => desc+'\n\nBang (0 [E] card): Deal 0 damage 3 (4) times. Add a Whiz(+) to your discard pile. Exhaust.'}
                }
            ],
    
            "relics": [
                {
                    "where": {"name": "Bronze Idol"},
                    "to": {"description": "Status cards now cost [E] and may be played for useful effects.\n\nSlimed -> Lubricant: Draw 2 cards. Exhaust.\nWound -> Grievous Wound: Apply 1 Vulnerable.\nVoid -> Into the Void: Ethereal. Enemy loses 5 Strength this turn. Whenever this card is drawn, lose 1 Energy. Exhaust.\nDazed -> Daze: Ethereal. Apply 1 Weak. Exhaust.\nBurn -> Ignite: Apply 10 :Soulburn. At the end of your turn, take 2 damage.\n"}
                },
    
                {
                    "where": {"name": "Supply Scroll"},
                    "to": {"description": desc => desc+"\nSupply Scroll (0 [E] card): Gain a random assortment of 4 (6) Shivs and Wards. Exhaust."}
                },
    
                {
                    "where": {"name": "Knowing Skull"},
                    "to": {"description": "At the start of each combat, add a **Knowing Skull** to your hand."}
                },
                
                {
                    "where": {"name": "Greed Ooze"},
                    "to": {"description": desc => desc.replace(' (can be revived if Absorbed)', '')+'\nWhen Greed Ooze is absorbed gain Revive Greed.\nRevive Greed (2 (1) [E] ): Retain. Split into Greed Ooze. Exhaust.'}
                }
            ],
    
            "potions": [
                {
                    "where": {"name": "Blood Potion"},
                    "to": {"color": "Red"}
                },
    
                {
                    "where": {"name": "Poison Potion"},
                    "to": {"color": "Green"}
                },
    
                {
                    "where": {"name": "Bottled Miracle"},
                    "to": {"color": "Purple"}
                },
    
                {
                    "where": {"name": "Jar of Slime"},
                    "to": {"color": "Slimebound"}
                },
    
                {
                    "where": {"name": "Potentially Potent Potion"},
                    "to": {"color": "Snecko_cyan"}
                },
    
                {
                    "where": {"name": "Tonic"},
                    "to": {"color": "Hermit_yellow"}
                },
    
                {
                    "where": {"name": "Machine Oil"},
                    "to": {"color": "The_bronze_automaton"}
                },
    
                {
                    "where": {"name": "Ecto-Cooler"},
                    "to": {"color": "Hexa_ghost_purple"}
                },
    
                {
                    "where": {"name": "Strategy Potion"},
                    "to": {"color": "The_champ_gray"}
                },
    
                {
                    "where": {"name": "Temporal Potion"},
                    "to": {"color": "Guardian"}
                },
    
                {
                    "where": {"name": "Elixir"},
                    "to": {"color": "Red"}
                },
    
                {
                    "where": {"name": "Cunning Potion"},
                    "to": {"color": "Green"}
                },
    
                {
                    "where": {"name": "Potion Of Capacity"},
                    "to": {"color": "Blue"}
                },
    
                {
                    "where": {"name": "Stance Potion"},
                    "to": {"color": "Purple"}
                },
    
                {
                    "where": {"name": "Slimy Elixir"},
                    "to": {"color": "Slimebound"}
                },
    
                {
                    "where": {"name": "Polishing Oil"},
                    "to": {"color": "Guardian"}
                },
    
                {
                    "where": {"name": "Alchyrical Elixir"},
                    "to": {"color": "The_bronze_automaton"}
                },
    
                {
                    "where": {"name": "Exotic Beverage"},
                    "to": {"color": "Snecko_cyan"}
                },
    
                {
                    "where": {"name": "Bottled Technique"},
                    "to": {"color": "The_champ_gray"}
                },
    
                {
                    "where": {"name": "Combustive Fluid"},
                    "to": {"color": "Hexa_ghost_purple"}
                },
    
                {
                    "where": {"name": "Eau de Grem"},
                    "to": {"color": "Gremlin"}
                },
    
                {
                    "where": {"name": "Black Bile"},
                    "to": {"color": "Hermit_yellow"}
                },
    
                {
                    "where": {"name": "Heart of Iron"},
                    "to": {"color": "Red"}
                },
    
                {
                    "where": {"name": "Ghost in a Jar"},
                    "to": {"color": "Green"}
                },
    
                {
                    "where": {"name": "Essence Of Darkness"},
                    "to": {"color": "Blue"}
                },
    
                {
                    "where": {"name": "Ambrosia"},
                    "to": {"color": "Purple"}
                },
    
                {
                    "where": {"name": "Liquid Void"},
                    "to": {"color": "Hermit_yellow"}
                },
    
                {
                    "where": {"name": "Stimpack"},
                    "to": {"color": "The_champ_gray"}
                },
    
                {
                    "where": {"name": "Liquid Luck"},
                    "to": {"color": "Snecko_cyan"}
                },
    
                {
                    "where": {"name": "Quantum Elixir"},
                    "to": {"color": "Guardian"}
                },
    
                {
                    "where": {"name": "Inferno Potion"},
                    "to": {"color": "Hexa_ghost_purple"}
                },
    
                {
                    "where": {"name": "Kio's Clever Concoction"},
                    "to": {"color": "The_bronze_automaton"}
                },
    
                {
                    "where": {"name": "Gremlin In A Jar"},
                    "to": {"color": "Gremlin"}
                },
    
                {
                    "where": {"name": "Army in a Bottle"},
                    "to": {"color": "Slimebound"}
                }
            ],

            "creatures": [
                {
                    "where": {"name": "Neow", type: "Boss"},
                    "to": {"img": "/export/downfall/creatures/NeowBossFinal.png"}
                },

                {
                    "where": {"name": "Mystic"},
                    "to": {"img": "/export/slay-the-spire/creatures/Healer.png"}
                },

                {
                    "where": {"name": "Book of Stabbing"},
                    "to": {"img": "/export/slay-the-spire/creatures/BookOfStabbing.png"}
                },

                {
                    "where": {"name": "The Champ", type: "Boss"},
                    "to": {"img": "/export/slay-the-spire/creatures/Champ.png"}
                },

                {
                    "where": {"name": "The Ironclad", type: "Elite"},
                    "to": {"img": "/export/downfall/creatures/GauntletIronclad.png"}
                },

                {
                    "where": {"name": "The Silent", type: "Elite"},
                    "to": {"img": "/export/downfall/creatures/GauntletSilent.png"}
                },

                {
                    "where": {"name": "The Defect", type: "Elite"},
                    "to": {"img": "/export/downfall/creatures/GauntletDefect.png"}
                },

                {
                    "where": {"name": "The Watcher", type: "Elite"},
                    "to": {"img": "/export/downfall/creatures/GauntletWatcher.png"}
                },

                {
                    "where": {"name": "The Hermit", type: "Elite"},
                    "to": {"img": "/export/downfall/creatures/GauntletHermit.png"}
                }
            ],
    
            "keywords": [
                {
                    "where": {"name": "Gremlin Nob"},
                    "to": {"description": "At the start of your turn, add the following cards with Ethereal and Exhaust to your hand:\n\nBellow (0 [E] ): Gain 2 (3) Strength for each enemy that does not intend to Attack.\nSkull Bash (1 [E] ): Deal 6 (8) damage. Apply 2 Vulnerable.\nRush (1 [E] ): Deal 14 (16) damage.\n\nYou can no longer :Swap. When you would lose all :Temporary :HP, prevent further damage and revert back."}
                }
            ]
        }
    }
}
