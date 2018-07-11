import React, { Component } from "react";
import Container from "../../components/Container";
import SmallCard from "../../components/SmallCard";
import "./home.css";
import API from "../../utils/API";



class Home extends Component {
	state = {
		categories: [],
		//categories: ["Chinese", "Mexican", "Korean", "American", "Steakhouse", "Italian", "Seafood", "Breakfast", "Pizza", "Burger", "Thai", "Japanese", "Vietnamese", "Sandwiches", "Sushi Bar"],
		restaurants: [
			{
				img: "http://placehold.it/100x100",
				name: "Restaurant 1",
				info: "Restaurant 1 info",
			},
			{
				img: "http://placehold.it/100x100",
				name: "Restaurant 2",
				info: "Restaurant 2 info",
			},
			{
				img: "http://placehold.it/100x100",
				name: "Restaurant 3",
				info: "Restaurant 3 info",
			},
			{
				img: "http://placehold.it/100x100",
				name: "Restaurant 4",
				info: "Restaurant 4 info",
			},
			{
				img: "http://placehold.it/100x100",
				name: "Restaurant 5",
				info: "Restaurant 5 info",
			},
			{
				img: "http://placehold.it/100x100",
				name: "Restaurant 6",
				info: "Restaurant 6 info",
			},
		]
	};

	componentDidMount() {
		this.loadCategories();

	}

	loadCategories = () => {
		API.getCategories().then(response => {
			console.log(response.data)
			this.setState({
				categories: response.data
			});
		});
	}

	render() {
		return (
			<div>
				<div className="jumbotron">
					<h1 id="mainTitle">Welcome to Picky Eats!</h1>

					<h3 id="subtitle">The search for your next favorite dish starts here!</h3>

					<input type="text" className="homeSearch" placeholder="Search by Restaurant..." />
					<input type="text" className="homeSearch" placeholder="City" />
					<button className="btn">Search</button>

					<div></div>

					<div className="dropdown">
						<button className="dropbtn">I'm in the mood for</button>
						<div className="dropdown-content">
							{this.state.categories.map(category => (
								<a href={'/ressearch/' + category._id} key={this.state.categories.id} value={category.categoryName}>{category.categoryName}</a>
							))}
						</div>
					</div>
				</div>

				<Container>
					<div className="featuredRestaurants">
						<h1 className="title">Featured Restaurants</h1>
						{this.state.restaurants.map(restaurant => (
							<SmallCard
								name={restaurant.name}
								img={restaurant.img}
								info={restaurant.info}
							/>
						))}
					</div>
				</Container>
			</div>
		)
	};

};

export default Home;