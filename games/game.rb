def start
  puts "Welcome to my inn, Stranger! Grab a seat."
  puts "1. Take a seat at the bar"
  puts "2. Take a seat away from the crowd"

  action = gets.chomp

  if action == "1"
    puts "You sit down at the bar."
    
  elsif action == "2"
    puts "You sit down at an empty corner table."
    
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

  

  if action == "1"
    puts "You order a cup of coffee."
    #look_around()
  elsif action == "2"
    puts "You order a glass of water."
    #look_around()
  else
    puts "Invalid option."
    bar_sit()
  end
end

def table_sit
  
end
