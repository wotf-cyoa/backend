def start
  puts "Welcome to my inn, Harry POTTER! Grab a seat."
  puts "1. Take a seat at the bar"
  puts "2. Take a seat away from the crowd"

  action = gets.chomp

  if action == "1"
    puts "You sit down at the bar."
    bar_sit()
  elsif action == "2"
    puts "You sit down at an empty corner table."
    table_sit()
  else
    puts "Invalid option."
    start()
  end
end

def bar_sit
  puts "The innkeeper looks you up and down, her eyes lingering on your star-speckled hat."
  puts "She scowls and asks 'What'll it be, then?'"
  puts "1. Order a cup of coffee"
  puts "2. Order a glass of water"

  action = gets.chomp

  if action == "1"
    puts "You order a cup of coffee."
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
  puts "A waiter spies your star-speckled hat and hurries over to take your order."
  puts "He smiles and asks 'What would you like to drink today?'"
  puts "1. Order a cup of coffee"
  puts "2. Order a glass of water"

  action = gets.chomp

  if action == "1"
    puts "You order a cup of coffee."
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
  puts "As you wait for your drink, you take a look around."
  puts "Near the hearth, a musician is playing a rawdy ballad on his lute to the stomping delight of many patrons."
  puts "Wonderful smells are wafting in from the kitchen. Suddenly, the door to the inn explodes into fiery splinters."
  puts "A dragon enters the inn."
  puts "1. Run. FAST."
  puts "2. Stay and fight."

  action = gets.chomp

  if action == "1"
    puts "There is nowhere to run. The dragon eats you."
  elsif action == "2"
    puts "Your spells bounce off the dragon's armor. The dragon eats you."
  else
    puts "Invalid option, but the dragon eats you anyway."
  end
end

