require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/**
 * GET
 * HomePage
 */

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const indian = await Recipe.find({ category: "Indian" }).limit(limitNumber);
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, american, indian, chinese };

    res.render("index", { title: "Cooking Blog-Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", { title: "Cooking Blog-Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};





/**
 * GET /categories/:id
 * Categories By ID
 */

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', {title: "Cooking Blog- Categories", categoryById });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};






/**
 * GET /recipe/:id
 * \Recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    res.render("recipe", { title: "Cooking Blog-Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};   


/**
 * POST / search
 * Search
 */

exports.searchRecipe = async (req, res) => {

  // searchTerm
   try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text:{$search:searchTerm,$diacriticSensitive:true}});
    
    res.render("search", { title: "Cooking Blog-Search" ,recipe});
   } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
   }


}



// exploreLatest

/**
 * GET /explore-latest
 * \Explore-Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber=20;
    const recipe= await Recipe.find({}).sort({ _id: -1}).limit(limitNumber);
    res.render('explore-latest', { title: "Cooking Blog-Explore Latest", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}; 




// exploreRandom

/**
 * GET /explore-random
 * \Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
   
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random()*count);
    let recipe=await Recipe.findOne().skip(random).exec();

    res.render('explore-random', { title: "Cooking Blog-Explore Latest", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}; 




// exploreRandom

/**
 * GET /submit-recipe
 * \Submit Recipe
 */
exports.submitRecipe = async (req, res) => {


  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');

  res.render('submit-recipe', { title: "Cooking Blog-Submit Recipe",infoErrorsObj, infoSubmitObj });
}




/**
 * POST /submit-recipe
 * \Submit Recipe
 */

exports.submitRecipeOnPost = async (req, res) => {


  try {


      let imageUploadFile;
      let uploadPath;
      let newImageName;

      if(!req.files || Object.keys(req.files).length===0){
        console.log('No files were uploaded.');
      } else {

        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;

        uploadPath = require('path').resolve('./') + '/public/img' + newImageName;

        imageUploadFile.mv(uploadPath,function(err){
          if(err) return res.status(500).send(err);
        })
      }

      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
      });
    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    // res.json(error);
    req.flash("infoErrors",error);
    res.redirect("/submit-recipe");

    
  }
 
};



// To update any recipes 

// async function updateRecipe(){

//   try {
//     const res = await Recipe.updateOne({name:'INDIAN RECIPE'},{name:'Indian Recipe'});
//     res.n; //number of document matched
//     res.nModified; // number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();



// To delete any recipes

// async function deleteRecipe(){

//   try {
//     await Recipe.deleteOne({name:'New Chocolate Cake'});
    
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();























// exports.Recipes = async (req, res) => {
//   try {
//     const limitNumber = 20;
//     const recipes = await Recipe.find({}).limit(limitNumber);
//     res.render("recipes", { title: "Cooking Blog-Recipes", recipes });
//   } catch (error) {
//     res.status(500).send({ message: error.message || "Error Occured" });
//   }
// };

// async function insertDummyCategoryData() {
//   try {
//     await Category.insertMany([
//       {
//         name: "Thai",
//         image: "thai-food.jpg",
//       },
//       {
//         name: "American",
//         image: "american-food.jpg",
//       },
//       {
//         name: "Chinese",
//         image: "chinese-food.jpg",
//       },
//       {
//         name: "Mexican",
//         image: "mexican-food.jpg",
//       },
//       {
//         name: "Indian",
//         image: "indian-food.jpg",
//       },
//       {
//         name: "Spanish",
//         image: "spanish-food.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log("err", +error);
//   }
// }

// insertDummyCategoryData();

// async function insertDymmyRecipeData() {
//   try {
//     await Recipe.insertMany([
      // {
      //   name: "Grilled lobster rolls",
      //   description: `Remove the butter from the fridge and allow to soften.
      //                         Preheat a griddle pan until really hot.
      //                         Butter the rolls on both sides and grill on both sides until toasted and lightly charred (keep an eye on them so they don’t burn).
      //                         Trim and dice the celery, chop the lobster meat and combine with the mayonnaise. Season with sea salt and black pepper to taste.
      //                         Open your warm grilled buns, shred and pile the lettuce inside each one and top with the lobster mixture.Serve immediately.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "85 g butter",
      //     "6 submarine rolls",
      //     "500 g cooked lobster meat, from sustainable sources",
      //     "1 stick of celery",
      //     "2 tablespoons mayonnaise , made using free-range eggs",
      //     "½ an iceberg lettuce",
      //   ],
      //   category: "American",
      //   image: "lobsterrolls.jpeg",
      // },
      // {
      //   name: "BBQ beef short ribs",
      //   description: `Preheat the oven to 100ºC/212ºF/gas ¼.
      //          Place the ribs in a snug-fitting roasting tray, season with sea salt and black pepper, drizzle with oil, then rub all over. Cover tightly with a double layer of tin foil, then cook for 7 to 8 hours, or until tender.
      //          When the time’s up, transfer the ribs to a baking tray. Skim away the fat from the roasting tray and reserve in an airtight jar (use it for delicious roast potatoes another day).Place the roasting tray over a high heat on the hob and bring the juices to the boil. Simmer for around 2 minutes, then add the remaining sauce ingredients. Bring back to the boil, then reduce the heat to low and simmer for a further 10 minutes, or until the sauce has thickened and coats the back of a spoon.Brush most of the sauce onto the ribs so they’re nicely coated all over, then return the ribs to the oven for 20 to 40 minutes, or until sticky and caramelised to your liking.Meanwhile, place a small frying pan over a medium heat. Add the caraway seeds and toast for around 1 minute, or until smelling fantastic. Tip into a large bowl.Finely chop the dill and pickled onions, then add to the bowl with the mayo, yoghurt, mustard, white wine vinegar and a splash of the pickled onion vinegar. Whisk well to combine.Remove the beetroot leaves and set aside. Scrub and trim the beetroot and carrots, then pass all the vegetables and the beetroot leaves through the fine slicing attachment in a food processor. Add to the dressing, toss and scrunch everything together, then season to taste.Transfer the ribs to a chopping board, then carve up and serve with the winter slaw, remaining BBQ sauce and creamy mashed potato, if you like.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "2 x 1.5 kg beef short ribs",
      //     "olive oil",
      //     "2 teaspoons caraway seeds",
      //     "1 bunch of fresh dill",
      //     "2 pickled onions , in vinegar",
      //     "2 tablespoons Hellmann's Real Mayonnaise",
      //     "2 tablespoons low-fat natural yoghurt",
      //     "2 teaspoons English mustard",
      //     "1½ tablespoons white wine vinegar",
      //     "1 medium yellow beetroot , with leaves",
      //     "6 medium carrots",
      //     "¼ of a white cabbage",
      //     "300 g kale , green and purple, if possible",
      //   ],
      //   category: "American",
      //   image: "bbq.jpg",
      // },
      // {
      //   name: "Key lime pie",
      //   description: `Preheat the oven to 175ºC/gas 3. Lightly grease a 22cm metal or glass pie dish with a little of the butter.
      // For the pie crust, blend the biscuits, sugar and remaining butter in a food processor until the mixture resembles breadcrumbs.
      // Transfer to the pie dish and spread over the bottom and up the sides, firmly pressing down.
      // Bake for 10 minutes, or until lightly browned. Remove from oven and place the dish on a wire rack to cool.
      // For the filling, whisk the egg yolks in a bowl. Gradually whisk in the condensed milk until smooth.
      // Mix in 6 tablespoons of lime juice, then pour the filling into the pie crust and level over with the back of a spoon.
      // Return to the oven for 15 minutes, then place on a wire rack to cool.
      // Once cooled, refrigerate for 6 hours or overnight.
      // To serve, whip the cream until it just holds stiff peaks. Add dollops of cream to the top of the pie, and grate over some lime zest, for extra zing if you like.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "4 large free-range egg yolks",
      //     "400 ml condensed milk",
      //     "5 limes",
      //     "200 ml double cream",
      //     "CRUST",
      //     "135 g unsalted butter",
      //     "12 digestive biscuits",
      //     "45 g caster sugar",
      //   ],
      //   category: "American",
      //   image: "keylimepie.jpg",
      // },
      // {
      //   name: "Crab Cakes",
      //   description: `Trim and finely chop the spring onions, and pick and finely chop the parsley. Beat the egg.
      // Combine the crabmeat, potatoes, spring onion, parsley, white pepper, cayenne and egg in a bowl with a little sea salt.
      // Refrigerate for 30 minutes, then shape into 6cm cakes.
      // Dust with flour and shallow-fry in oil over a medium heat for about 5 minutes each side or until golden-brown.
      // Serve with pinches of watercress and a dollop of tartare sauce.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "3 spring onions",
      //     "½ a bunch of fresh flat-leaf parsley",
      //     "1 large free-range egg",
      //     "750 g cooked crabmeat , from sustainable sources",
      //     "300 g mashed potatoes",
      //     "1 teaspoon ground white pepper",
      //     "1 teaspoon cayenne pepper",
      //     "plain flour , for dusting",
      //     "olive oil",
      //     "watercress",
      //     "tartare sauce",
      //   ],
      //   category: "American",
      //   image: "crabcakes.jpg",
      // },
      // {
      //   name: " Southern Indian vegetable curry",
      //   description: `Deseed the chillies and peel the onions, then finely chop both.
      // Heat 2 tablespoons of oil in a large frying pan over a medium heat, add the mustard seeds and fry for 2 to 3 minutes, or until they start to pop.
      // Add the chillies, curry leaves, onions, coriander, cumin seeds, garam masala, turmeric, and chilli powder to the pan, and cook for 5 to 10 minutes, or until the onions are soft.
      // Meanwhile, roughly chop the tomatoes, and peel and cube the sweet potatoes, regular potatoes and aubergine.
      // Stir in the chopped tomatoes, potatoes and aubergine, then pour in the coconut milk and cook until the potato is tender, stirring occasionally.
      // Slice the okra and trim the beans, then add to the pan with the peas for a further few minutes, until tender, but still with a bit of bite.
      // Taste and season to perfection with sea salt and black pepper, then serve with some fluffy rice.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "2 fresh green chillies",
      //     "2 onions",
      //     "olive oil",
      //     "1 teaspoon mustard seeds",
      //     "1 bunch of curry leaves",
      //     "½ teaspoon ground coriander",
      //     "1 pinch of ground cumin",
      //     "½ teaspoon garam masala",
      //     "¼ teaspoon ground turmeric",
      //     "¼ teaspoon chilli powder",
      //     "6 ripe tomatoes",
      //     "2 sweet potatoes",
      //     "2 potatoes",
      //     "1 aubergine",
      //     "100 ml coconut milk",
      //     "1 handful of okra",
      //     "1 handful of French beans",
      //     "1 handful of peas",
      //   ],
      //   category: "Indian",
      //   image: "vegetablecurry.jpg",
      // },
      // {
      //   name: "Jamie's south Indian prawn curry",
      //   description: `Fill a medium pan with salted water, place over a high heat and bring to a boil.
      // Peel and finely slice the garlic and onion, then peel and finely grate the ginger. Halve and deseed the chilli, then finely slice. Roughly chop the tomatoes.
      // Add the rice to the boiling water and cook for 10 minutes, or until tender. Drain in a sieve, then return to the warm pan, cover with a lid and set aside off the heat.
      // Heat 2 tablespoons of oil in a medium pan over a medium heat, add the mustard seeds, garam masala and turmeric, then fry for 1 minute.
      // Add the onion, garlic and ginger, then fry for 10 minutes, or until softened. Add the chilli, tomatoes and a splash of water, then turn the heat up and cook for a further 3 minutes.
      // Next, add the prawns and coconut milk, bring to the boil then reduce the heat slightly and simmer gently for 3 to 4 minutes, or until the prawns are just cooked.
      // Stir through the spinach and cook for a further 1 to 2 minutes until the spinach has wilted.
      // Divide the rice between plates. Season the prawn curry to taste with salt, black pepper and a squeeze of lime juice, then ladle the curry onto the rice. Serve with the remaining lime, cut into wedges for squeezing over.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "1 clove of garlic",
      //     "1 red onion",
      //     "7 cm piece of ginger",
      //     "1 fresh green chilli",
      //     "200 g ripe tomatoes",
      //     "175 g basmati rice",
      //     "vegetable oil",
      //     "1 teaspoon black mustard seeds",
      //     "1½ teaspoons garam masala",
      //     "¾ teaspoon ground turmeric",
      //     "120 g large raw peeled tiger prawns , from sustainable sources",
      //     "½ x 400 g tin of light coconut milk",
      //     "125 g baby spinach",
      //     "1 lime",
      //   ],
      //   category: "Indian",
      //   image: "prawncurry.jpg",
      // },
      // {
      //   name: "Vegan Chinese noodles",
      //   description: `Cook the noodles according to packet instructions, drain well, rinse under cold running water, then set aside.
      // Finely slice or tear the mushrooms, leaving any smaller ones whole. Peel the garlic and deseed the chilli, then finely slice. Peel the ginger and trim the courgettes, then slice both into matchsticks.
      // Pick the coriander leaves and set aside, then finely slice the stalks. Trim and finely slice the spring onions, reserving the green part for later.
      // Heat a good lug of oil in a large wok over a high heat, then add the mushrooms and fry for 3 to 4 minutes, or until slightly softened.
      // Add the chopped garlic, chilli, ginger, courgette, coriander stalks and the white part of the spring onions. Fry for a further 3 minutes, or until softened and lightly golden.
      // Meanwhile, combine the cornflour and 2 tablespoons of water, then mix in the soy, agave syrup, sesame oil and rice wine or sherry. Stir the mixture into the pan and cook for a further 3 minutes, or until thickened.
      // Roughly chop and add the spinach along with the noodles. Toss well to warm through, then tear in most of the coriander leaves.
      // Serve with lime wedges, sambal or chilli sauce and the reserved coriander and spring onions scattered on top.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "200 g thin rice noodles",
      //     "300 g mixed oriental mushrooms , such as oyster, shitake and enoki, cleaned",
      //     "2 cloves of garlic",
      //     "1 fresh red chilli",
      //     "5 cm piece of ginger",
      //     "200 g courgettes",
      //     "½ bunch of fresh coriander",
      //     "6 spring onions",
      //     "groundnut oil , or vegetable oil",
      //     "1 teaspoon cornflour",
      //     "2 tablespoons low-salt soy sauce",
      //     "1 tablespoon agave syrup",
      //     "1 teaspoon seasame oil",
      //     "½ tablespoon rice wine , or dry sherry",
      //     "100 g baby spinach",
      //     "2 limes , to serve",
      //     "sambal , or hot chilli sauce, to serve",
      //   ],
      //   category: "Chinese",
      //   image: "veganchinese.jpg",
      // },
      // {
      //   name: " Stir-fried vegetables",
      //   description: `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion, and mix with the garlic, chilli and spring onion.
      // Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl to the onion mixture.
      // Heat your wok until it’s really hot. Add a splash of oil – it should start to smoke – then the chilli and onion mix. Stir for just 2 seconds before adding the other mix. Flip and toss the vegetables in the wok if you can; if you can’t, don’t worry, just keep the vegetables moving with a wooden spoon, turning them over every few seconds so they all keep feeling the heat of the bottom of the wok. Season with sea salt and black pepper.
      // After a minute or two, the vegetables should have begun to soften. Add the soy sauce and 1 teaspoon of sesame oil and stir in. After about 30 seconds the vegetables should smell amazing! Tip on to a serving dish, sprinkle over some sesame seeds and tuck in.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "1 clove of garlic",
      //     "1 fresh red chilli",
      //     "3 spring onions",
      //     "1 small red onion",
      //     "1 handful of mangetout",
      //     "a few shiitake mushrooms",
      //     "a few water chestnuts",
      //     "1 handful of shredded green cabbage",
      //     "olive oil",
      //     "2 teaspoons soy sauce",
      //     "sesame oil",
      //     "sesame seeds , to sprinkle on top",
      //   ],
      //   category: "Chinese",
      //   image: "stirfried.jpg",
      // },
      //       {
      //         name: "Mexican-style eggs",
      //         description: `Recipe kindly shared by the Tesco Community Cookery School with Jamie Oliver. The recipe has been written to be flexible and scalable up to 50 portions. Note: all veg weights are for trimmed, prepped vegetables.
      // Preheat the oven to 180°C/350°F/gas 4. Peel (or trim) and finely slice the alliums and Mediterranean veg. Finely chop and deseed the chillies (if using).
      // Place a pan large enough to hold all the ingredients on a medium heat with the oil.
      // Add the alliums, chillies (or chilli flakes) and veg, and cook for 20 minutes or until golden and softened.
      // Drain the beans and add to the pan, along with the tomato base sauce and simmer for 10 minutes, stirring occasionally. Season to taste with sea salt and black pepper.
      // Transfer the mixture to a deep oven tray (approx 40cm x 60cm) and give it a little shake to fill the corners. Make 10 wells in the sauce and crack in the eggs.
      // Crumble over the feta or grate over the hard cheese, and bake for 10 minutes, or until the whites are set but the yolks are still runny. Dish up and enjoy!`,
      //         email: "virajdesai3011@gmail.com",
      //         ingredients: [
      //           "120 g alliums (onions, leeks or a mixture of both)",
      //           "1.3 kg Mediterranean veg",
      //           "2 fresh red chillies , or a pinch of chilli flakes",
      //           "20 ml olive oil",
      //           "2 x 400 g tins black beans , (470g drained weight)",
      //           "2 litres tomato base sauce",
      //           "10 free-range eggs",
      //           "150 g feta or hard cheese",
      //         ],
      //         category: "Mexican",
      //         image: "mexican-food1.jpg",
      //       },
      //       {
      //         name: "Cool Mexican bean wraps",
      //         description: `Preheat the oven to 180°C/350°F/ gas 4. Peel and finely slice the onion, then deseed and slice up the pepper. Coarsely grate the cheese.
      // Heat a little oil in a frying pan over a medium-low heat and gently fry the onion for 10 minutes, or until softened.
      // Peel and crush the garlic, then add to the pan along with the chilli powder.
      // Add the tomato purée and the tomatoes, breaking them up with a spoon as you go, then drain and add the kidney beans.
      // Cook for 10 minutes, or until slightly reduced, then season to taste with sea salt and black pepper.
      // In a separate pan, fry the pepper in a little oil until starting to soften, then set aside.
      // Divide the filling mixture in half, then blitz one half with a stick blender to form a bean paste – if you don’t have a stick blender, mash with a potato masher.
      // Spread the tortillas with the warm bean paste, then add a serving spoon of the filling and a spoonful of red pepper, and sprinkle with cheese. Roll up the tortillas and place on greased baking tins.
      // Bake for 5 to 10 minutes, or until golden and warmed through.
      // Dress the salad leaves in a little oil and vinegar, then serve alongside your bean wraps.`,
      //         email: "virajdesai3011@gmail.com",
      //         ingredients: [
      //           "1 onion",
      //           "1 red pepper",
      //           "60g Cheddar cheese",
      //           "olive oil",
      //           "1 clove of grlic",
      //           "1 teaspoon chilli powder",
      //           "1 teaspoon tomato ",
      //           "1 400g tin plum tomatoes",
      //           "1 400g tin red kidney beans",
      //           "4 large flour tortillas",
      //           "2 large handfuls mixed salad leaves",
      //           "balsamic vinegar",
      //         ],
      //         category: "Mexican",
      //         image: "mexican-food1.jpg",
      //       },
      // {
      //   name: "Indian chopped salad",
      //   description: `Crumble the curry leaves into a small frying pan on a medium heat. Add a big lug of oil, and the fenugreek and mustard seeds.
      // Fry until the mustard seeds start to pop, then stir in the mango chutney. Remove from the heat and leave to cool.
      // Puff up the poppadoms by microwaving for a minute or two.
      // Peel and grate the carrots on a large board, then chop and add the cucumber, spring onions, radishes, lettuce, tomatoes and chilli (deseed it first), mixing and chopping as you go. Pick over the herb leaves and give it a good final chop.
      // Pour over the toasted spices, add a squeeze of lemon juice, a pinch of sea salt and mix and chop it all up with your knife. If it’s too dry, add extra oil and lemon juice.
      // Serve sprinkled with crunched-up poppadoms, and extra dollops of mango chutney, if you fancy.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "1 small handful of fresh or dry curry leaves",
      //     "1 teaspoon fenugreek seeds",
      //     "1 tesapoon mustard seeds",
      //     "rapeseed oil",
      //     "1 heaped teaspoon mango chutney",
      //     "4 uncooked poppadoms , optional",
      //     "2 carrots",
      //     "½ a cucumber",
      //     "4 spring onions",
      //     "1 bunch of radishes",
      //     "2 little gem lettuce",
      //     "2 big handfuls of ripe cherry tomatoes",
      //     "1 fresh red chilli",
      //     "1 bunch of fresh coriander",
      //     "1 bunch of fresh mint",
      //     "1 lemon",
      //   ],
      //   category: "Indian",
      //   image: "chopped.jpeg",
      // },
      // {
      //   name: "Indian-inspired frittata",
      //   description: `This dish is inspired by a trip to Delhi, where I saw street-food vendors doing the most extraordinary things with eggs, breads, and a rainbow of incredible spices. I wanted to bring together a few of those ideas to take the humble egg to a really exciting place. So, in homage to those street-food vendors, this frittata has the sweetness of mango chutney, the crunch of Bombay mix, and the savouriness of spinach, all held together with toasted chapatis – it’s just a joy to eat.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "4 wholemeal chapatis",
      //     "8 large free-range eggs",
      //     "2 tablespoons mango chutney",
      //     "50 g mature Cheddar cheese",
      //     "200 g baby spinach",
      //     "olive oil",
      //     "30 g Bombay mix",
      //     "½ a small red onion",
      //     "red wine vinegar",
      //     "2 tablespoons natural yoghurt",
      //   ],
      //   category: "Indian",
      //   image: "frittata.jpg",
      // },
      // {
      //   name: "Indian carrot salad",
      //   description: `Heat a large frying pan and fry your ground lamb until all the fat comes out of it. Add the garam masala and a good pinch of sea salt and give it a stir. Keep frying until the meat is lovely and crispy.
      // Shave the carrots into long thin strips with a speed peeler or a mandolin slicer and keep them to one side.
      // Heat a small frying pan over a moderate heat and toast the cumin seeds for 30 seconds – they will start to smell nutty and gorgeous. You’re not trying to cook the seeds here, you’re just waking their flavours up a bit.
      // Put them into a pestle and mortar and grind them up. Place the pan back on the heat and toast the sesame seeds until golden. Transfer them to a plate.
      // Slice your peeled shallots or onion wafer thin. As with all salads that contain onion, you don’t want to be coming across great big chunks! If you don’t feel confident about your knife skills, use the coarse side of a box grater instead. This will almost mush your onions to a purée, but at least you won’t come across any big bits.
      // To make your dressing, grate the lemon zest and squeeze the juice into a bowl and add the shallots or onion, grated ginger, ground cumin and a pinch of salt. Whisk everything together with about 5 tablespoons of extra virgin olive oil.
      // Pour the dressing over the carrots, add the coriander and mint leaves, and mix it all together using your fingers. It’s important that you have a little taste to check whether the dressing needs more lemon juice, oil or seasoning.
      // Divide the crunchy lamb mince between four plates and put the dressed salad on top. Sprinkle with the toasted sesame seeds. Served with naan bread, some yoghurt and lemon halves, this makes a great snack!`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "600 g quality coarsely ground lean lamb",
      //     "2 teaspoons garam masala",
      //     "500 g carrots (mixed colours if possible) , peeled",
      //     "1 tablespoon sesame seeds",
      //     "½ a bunch of fresh coriander (15g) , leaves picked",
      //     "½ a bunch of fresh mint (15g) , leaves picked DRESSING",
      //     "1 teaspoon cumin seeds",
      //     "3 shallots or 1 small red onion, peeled",
      //     "1 lemon",
      //     "1 heaped teaspoon freshly grated ginger",
      //     "extra virgin olive oil",
      //   ],
      //   category: "Indian",
      //   image: "carrotsalad.jpg",
      // },
      // {
      //   name: "Chinese steak & tofu stew",
      //   description: `Get your prep done first, for smooth cooking. Chop the steak into 1cm chunks, trimming away and discarding any fat.
      // Peel and finely chop the garlic and ginger and slice the chilli. Trim the spring onions, finely slice the top green halves and put aside, then chop the whites into 2cm chunks. Peel the carrots and mooli or radishes, and chop to a similar size.
      // Place a large pan on a medium-high heat and toast the Szechuan peppercorns while it heats up. Tip into a pestle and mortar, leaving the pan on the heat.
      // Place the chopped steak in the pan with 1 tablespoon of groundnut oil. Stir until starting to brown, then add the garlic, ginger, chilli, the white spring onions, carrots and mooli or radishes.
      // Cook for 5 minutes, stirring regularly, then stir in the chilli bean paste for 30 seconds until dark. Pour in the stock and simmer for 10 minutes.
      // Meanwhile, drain the beans, put them into a pan with the rice and a pinch of sea salt, and cover by 1cm with cold water. Place on a high heat, bring to the boil, then simmer until the water level meets the rice. Cover and leave on the lowest heat for 12 minutes, or until cooked through, stirring occasionally.
      // Taste the stew and season to perfection. Mix the cornflour with 2 tablespoons of cold water until combined, then stir into the stew.
      // Trim and stir in the broccoli. Chop the tofu into 2cm chunks and drop them in, then pop a lid on and keep on a low heat for 5 to 8 minutes while the stew thickens up and the broccoli just cooks through.
      // Serve the stew scattered with the sliced green spring onions, with the sticky rice and beans on the side. Finely crush and scatter over some Szechuan pepper. Nice with drips of chilli oil, to taste.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "250g rump or sirloin steak",
      //     "2 cloves of garlic",
      //     "4cm piece of ginger",
      //     "2 fresh red chilli",
      //     "1 bunch of spring onions",
      //     "2 large carrots",
      //     "250g mooli or radishes",
      //     "1 heaped teaspoon Szechuan peppercorns",
      //     "groundnut oil",
      //     "2 tablespoons Chinese chilli bean paste , (find it in Asian supermarkets)",
      //     "1 litre veg stock",
      //     "1 x 400g tin of aduki beans",
      //     "250g pudding or risotto rice",
      //     "1 tablespoon cornflour",
      //     "200g tenderstem broccoli",
      //     "350g firm silken tofu",
      //   ],
      //   category: "Chinese",
      //   image: "tofu.jpg",
      // },
      // {
      //   name: "Spring rolls",
      //   description: `Put your mushrooms in a medium-sized bowl, cover with hot water and leave for 10 minutes, or until soft. Meanwhile, place the noodles in a large bowl, cover with boiling water and leave for 1 minute. Drain, rinse under cold water, then set aside.
      // For the filling, finely slice the cabbage and peel and julienne the carrot. Add these to a large bowl with the noodles.
      // Slice the white part of the spring onions on the diagonal and add to the bowl. Finely slice the green parts into ribbons and reserve for later.
      // Peel and grate the ginger, then finely chop the chilli. Roughly chop the herbs and add to the bowl with the ginger and chilli.
      // Crush the peanuts and add to the bowl with the sesame oil, beansprouts, soy and oyster sauces, and mix well.
      // When they’re ready, drain the mushrooms, then chop them and stir into the filling. Season to taste.
      // In a small bowl, blend the cornflour and 2 tablespoons of cold water.
      // Next, lay one spring-roll wrapper, smooth-side down, on a clean surface as a diamond shape, with one corner pointing down towards you. Sprinkle a little of the five spice powder over it, then place another wrapper on top (the extra thickness will stop the rolls from breaking open while cooking).
      // Spoon 2 tablespoons of the filling on the bottom corner of the double wrapper. Brush each corner with the cornflour mixture, then start rolling up from the bottom. When the filling is covered, pull the corners in from each side (to seal the ends as you go). Continue rolling until the filling is tightly covered, then press to seal the top corner.
      // Lay the finished roll on a large baking tray and cover with a damp tea towel. Continue until you’ve filled all the wrappers.
      // Heat the groundnut oil in a large wok or saucepan over a medium heat. To check whether the oil is ready, drop in a piece of potato; it should sizzle and start to turn golden. In small batches, carefully lower the spring rolls into the oil and deep-fry for 2 to 3 minutes, or until golden brown. Remove with a slotted spoon and drain on kitchen paper.
      // Serve with the sweet chilli sauce and reserved sliced spring-onion tops.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "40 g dried Asian mushrooms",
      //     "50 g vermicelli noodles",
      //     "200 g Chinese cabbage",
      //     "1 carrot",
      //     "3 spring onions",
      //     "5 cm piece of ginger",
      //     "1 red chilli",
      //     "1 big bunch of fresh Thai basil , (30g)",
      //     "1 big bunch of fresh coriander , (30g)",
      //     "3 tablespoons toasted peanuts",
      //     "20 ml sesame oil",
      //     "75 g beansprouts , (ready to eat)",
      //     "2 tablespoons low-salt soy sauce",
      //     "2 tablespoons oyster sauce",
      //     "1 tablespoon cornflour",
      //     "16 large spring-roll wrappers , thawed if frozen",
      //     "1 tablespoon five-spice powder",
      //     "1 litre groundnut oil",
      //     "sweet chilli sauce , to serve",
      //   ],
      //   category: "Chinese",
      //   image: "springrolls.jpg",
      // },
      // {
      //   name: "Chicken chow mein with bok choi & water chestnuts ",
      //   description: `Put a pan of water on to boil. Peel and finely slice the ginger and garlic, then finely slice the chilli. Trim and finely slice the spring onions.
      // Pick the coriander leaves and put to one side, then finely chop the stalks. Halve the bok choi lengthways. Slice the chicken into finger-sized strips and lightly season.
      // Preheat a wok or large frying pan to high and once it’s very hot, add a good lug of oil and swirl it around. Stir in the chicken and cook for a couple of minutes, or until golden and cooked through.
      // Add the ginger, garlic, chilli, coriander stalks and half the spring onions. Stir-fry for 30 seconds, keeping everything moving round the pan quickly.
      // Cook the noodles and bok choi in the boiling water for just 2 to 3 minutes.
      // Add the cornflour, water chestnuts and their water to the wok and give it another good shake. Remove from the heat and stir in 2 tablespoons of soy sauce. Halve the lime, squeeze the juice of one half into the pan and mix well.
      // Drain the noodles and bok choi in a colander over a bowl, reserving the cooking water. Stir the noodles and bok choi into the pan, with a little cooking water to loosen, if necessary. Have a taste and season with more soy sauce, if needed.
      // Plate up and serve sprinkled with the rest of the spring onions and coriander leaves, with lime wedges on the side for squeezing over.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "4cm piece ginger",
      //     "2 cloves garlic",
      //     "1 fresh red chilli",
      //     "2 spring onions",
      //     "half bunch coriander",
      //     "1 bak choi",
      //     "1 large skinless chicen breast , higher-welfare groundnut oil",
      //     "100g free-range egg noodles",
      //     "1 heaped teaspoon cornflour",
      //     "1 220g tin water chestnuts",
      //     "3 tabslespoons soy sauce , low-salt",
      //     "1 lime",
      //   ],
      //   category: "Chinese",
      //   image: "chowmein.jpeg",
      // },
      // {
      //   name: "South American-style brunch",
      //   description: `Cook the quinoa according to the packet instructions, with a good pinch of sea salt.
      // Meanwhile, trim and finely slice all the chillies, slice the tomato, quarter the cherry tomatoes and trim and finely slice the spring onions.
      // Heat a good lug of olive oil in a frying pan over a high heat, add the cumin seeds and fry for around 30 seconds.
      // Drain and add the beans, followed by a pinch of salt and continue cooking for 5 to 8 minutes, or until crisp all over.
      // While the beans are cooking, place the sliced chillies into a bowl with the vinegar, sugar and a pinch of salt, then put aside.
      // Drain the quinoa well, then drizzle over a little extra virgin olive oil and the lemon juice and season lightly. Spread it out on a tray and leave aside to cool slightly.
      // Transfer the cooked beans to a bowl, wipe the pan clean and return to a medium heat with a splash of olive oil. Once hot, crack in the eggs and fry to your liking – for lovely, runny eggs, you only need a couple of minutes.
      // Transfer the quinoa to a large serving platter, layer the eggs on top and spoon over the crispy beans.
      // Halve and destone the avocado, then scoop out and dot over the flesh. Scatter the tomatoes, spring onions and chillies on top, then drizzle over a little of the pickling juice.
      // Pick and roughly chop the mint and coriander leaves and sprinkle on top, then add a drizzle of extra virgin olive and serve with plenty of hot chilli sauce.`,
      //   email: "virajdesai3011@gmail.com",
      //   ingredients: [
      //     "200 g quinoa",
      //     "1 long fresh red chilli",
      //     "1 fresh jalapeno chilli",
      //     "1 ripe tomato",
      //     "200 g ripe cherry tomatoes",
      //     "2 spring onions",
      //     "olive oil",
      //     "1 pinch of cumin seeds",
      //     "1 x 400 g tin of black beans or black-eyed beans",
      //     "2 tablespoons white wine vinegar",
      //     "1 pinch of golden caster sugar",
      //     "extra virgin olive oil",
      //     "½ a lemon",
      //     "6 large free-range eggs",
      //     "1 ripe avocado",
      //     "½ a bunch of fresh mint",
      //     "½ a bunch of fresh coriander",
      //     "hot chilli sauce",
      //   ],
      //   category: "American",
      //   image: "southamerican.jpg",
      // },
//     ]);
//   } catch (error) {
//     console.log("err", +error);
//   }
// }

// insertDymmyRecipeData();
