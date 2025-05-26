README


# Meal Planner

An intelligent meal planning application that helps you organize your meals, create shopping lists, and discover new recipes.

## ✨ Features

- 📅 **Weekly Planning** - Plan your meals for the entire week
- 🛒 **Automatic Shopping Lists** - Generate shopping lists based on your planned meals
- 👨‍👩‍👧‍👦 **Family Portions** - Adjust portion sizes for your family
- 🔍 **Search Function** - Find recipes based on ingredients or category
- 📱 **Responsive Design** - Works on all devices

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (version 22.8 or higher)
- npm (version 10.8)

### Installation with Docker

### Prerequisites
- Docker
```bash
docker compose -f docker-compose-dev.yml up -d
```

### Installation without Docker

1. Clone the repository:
```bash
git clone https://github.com/VikRic/Meal_Planner.git
cd Meal_Planner
```

2. Install dependencies:
```bash
npm run install-all
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend** Express
- **Styling:** CSS
- **State Management:** React Context
- **Database:** MongoDB
- **API:** https://spoonacular.com/food-api

## 📖 Usage

### Planning Meals
1. Go to recipes
2. Click add on the recipeCard you want added. The recipe will be added on the date and mealtime you have selected.

### Shopping lists
1. Navigate to the recipe page
2. The weekly ingredients will update automatically for each week.

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**VikRic**
- GitHub: [@VikRic](https://github.com/VikRic)

## 🙏 Acknowledgments

- Thanks to all contributors to the project
- Inspiration from modern meal planning apps

## 📞 Support

If you encounter issues or have questions:
- Open an [issue](https://github.com/VikRic/Meal_Planner/issues)
- Contact me via GitHub

## 🔮 Future Features

- [ ] Mobile app
- [ ] Nutrition calculation
- [ ] Create your own recipes
- [ ] Share recipes with friends
- [ ] Tick- off shopping list.
- [ ] AI-based recipe suggestions

---

⭐ Like the project? Give it a star on GitHub!
