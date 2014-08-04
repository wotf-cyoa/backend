$game_name = "Wizarding Rubies"
$character_name = "Magey Wizard"

def start
  puts "Welcome to my inn, " + $character_name + "! Grab a seat."
  puts "1. Take a seat at the bar"
  puts "2. Take a seat away from the crowd"
  puts "3. Leave the inn"
  action = gets.chomp

  if action == "1"
    puts "You sit down at the bar."
    bar_sit()
  elsif action == "2"
    puts "You sit down at an empty corner table."
    table_sit()
  elsif action == "3"
    puts "You leave the inn - the stench and noise were bothersome. Suddenly, a shadow drifts across the ground at your feet. You look up as a loud roar hammers your ear drums."
    puts "A dragon eats you."
    game_over()
  else
    puts "Invalid option."
    start()
  end
end

def bar_sit
  puts "The bartender looks you up and down, her eyes lingering on your star-speckled hat."
  puts "She scowls and asks 'What'll it be, then?'"
  puts "1. Order a pint of ale"
  puts "2. Order a glass of water"
  action = gets.chomp

  if action == "1"
    puts "You order a pint of ale."
    look_around()
  elsif action == "2"
    puts "You order a glass of water."
    look_around()
  else
    puts "Invalid option."
    bar_sit()
  end
end

def table_sit
  puts "A smiling waiter comes to your table. His smiles fades a bit when he sees your star-speckled hat."
  puts "He asks 'What can I get your mageship?'"
  puts "1. Order a pint of ale"
  puts "2. Order a glass of water"
  action = gets.chomp

  if action == "1"
    puts "You order a pint of ale."
    look_around()
  elsif action == "2"
    puts "You order a glass of water."
    look_around()
  else
    puts "Invalid option."
    table_sit()
  end
end

def look_around
  puts "As you wait for your drink, you drink in the environment. Near the hearth, a musician is playing a rawdy ballad on his lute to the stomping delight of many patrons. Wonderful smells are wafting from the kitchen. At a table nearby, a man with extremely grimy hair is playing host to a hushed conversation."
  puts "1. Cast a spell to improve your hearing to eavesdrop"
  puts "2. Shift your seat and lean toward the grimy-haired man's table to eavesdrop"
  action = gets.chomp

  if action == "1"
    puts "You mutter the spell under your breath. A small flash of light anoints both your earlobes, but thankfully no one seems to notice. Your hearing is improved!"
    puts "The wailing of the lute and the stomping of feet hammer your ear drums. Your head begins to ache from the noise. You quickly remove your spell. You decide it is better to eavesdrop the normal way."
    overhear_conversation()
  elsif action == "2"
    puts "You shift your seat. The grimy-haired man's companions glance at you suspiciously, but the man is too engrossed in his whispering to notice anything."
    puts "You lean towards their table."
    overhear_conversation()
  else
    puts "Invalid option."
    look_around()
  end
end

def overhear_conversation
  puts "Your order arrives. As you sit nursing your drink, you catch snatches of the conversation at the nearby table. They are talking about the location of a magical ruby."
  puts "Your magey sense is tingling. You hear the words 'map' and 'my room'."
  puts "1. Cast a spell to steal the grimy man's key."
  action = gets.chomp

  if action == "1"
    puts "You mutter the spell under your breath as you place your hand behind your back, palm facing upwards. The key flies from the man's pocket and into your waiting hand."
    go_to_room()
  else
    puts "Invalid option."
    overhear_conversation()
  end
end

def go_to_room
  puts "You drop a coin by your drink and head for the inn's rooms. You glance at the key to find the room number helpfully printed on the side: 6. Finding the room is easy."
  puts "You open the door and slip inside. Your eyes are immediately drawn to the plate by the window - on it sits a glorious cookie."
  puts "1. Click the cookie."
  action = gets.chomp

  if action == "1"
    puts "You click the cookie."
  else
    puts "Invalid option."
    go_to_room()
  end
end

def game_over
  puts "Game over. Type start() to start again"
end
