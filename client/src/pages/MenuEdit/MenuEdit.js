import React, { Component } from "react";
import Container from "../../components/Container";
import "./menuEdit.css";
import API from "../../utils/API";
//import MDSpinner from "react-md-spinner";

class MenuEdit extends Component {
    state = {
        dishName: "",
        description: "",
        price: "",
        menutype: "",
        menuItems: [],
        ids: [],
        updateId: "",
        isEdit: false,
        types: ["Appetizer", "Breakfast", "Lunch", "Dinner", "Drink", "Kids"],
        selectedFile: ""
    };

    handleInputChange = e => {
        console.log(e.target.name);
        switch (e.target.name) {
            case 'selectedFile':
                this.setState({ selectedFile: e.target.files[0] });
                break;
            default:
                this.setState({ [e.target.name]: e.target.value });
        }
    };

    addMenuItem = (event) => {
        event.preventDefault();
        console.log("imgname" + this.state.selectedFile);
        console.log("params id" + this.props.match.params.id);
        const restId = this.props.match.params.id;
        const formData = new FormData();
        formData.append('restaurantId', restId);
        formData.append('dishName', this.state.dishName);
        formData.append('description', this.state.description);
        formData.append('price', this.state.price);
        formData.append('imgpath', this.state.selectedFile);
        formData.append('menutype', this.state.menutype);

        API.saveMenuItem(formData, restId).then(response => {
            this.setState({ ids: [...this.state.ids, response.data._id] });
            this.setState({ menuItems: [...this.state.menuItems, response.data] });
            this.setState(
                {
                    dishName: "",
                    description: "",
                    price: "",
                    menutype: "",
                    selectedFile: ""
                });

        }).catch(err => console.log(err));
    }
    loadAllMenus = (restId) => {
        API.getAllMenus(restId).then(response => {
            this.setState({ menuItems: response.data });
        }).catch(err => console.log(err));
    }
    deleteMenuItem = (event) => {
        event.preventDefault();
        const menuId = event.target.value;
        // const restId=this.props.match.params.id;
        console.log("delete id" + menuId);
        API.removeMenuItem(menuId).then(response => {
            let newArrIds = this.state.ids.filter((x) => x._id !== menuId);
            let newMenuItems = this.state.menuItems.filter(item => item._id !== menuId);
            this.setState({
                ids: newArrIds,
                menuItems: newMenuItems
            });

            console.log("menu item deleted" + response.data);

        }).catch(err => console.log(err));

    }

    updateMenuItem = (event) => {
        event.preventDefault();
        const menuId = event.target.value;
        console.log(menuId);
        const restId = this.props.match.params.id;
        const menuItemData = {
            restaurantId: restId,
            dishName: this.state.dishName,
            description: this.state.description,
            price: this.state.price,
            menutype: this.state.menutype
        }
        API.editMenuItem(menuItemData, menuId).then(response => {
            const foundIndex = this.state.menuItems.findIndex(item => item._id === menuId);
            const newMenuItems = this.state.menuItems;
            newMenuItems[foundIndex] = response.data;
            this.setState({ menuItems: newMenuItems });
            this.setState(
                {
                    dishName: "",
                    description: "",
                    price: "",
                    menutype: "",
                    isEdit: false
                });

        }).catch(err => console.log(err));
    }

    editMenuItem = (event) => {
        this.setState({ isEdit: true });
        event.preventDefault();
        const menuId = event.target.value;
        console.log(menuId);
        this.setState({ updateId: menuId });
        this.state.menuItems.map(item => {
            console.log("itemId" + item._id);
            if (item._id == menuId) {
                this.setState({
                    dishName: item.dishName,
                    description: item.description,
                    menutype: item.menutype,
                    price: item.price
                });
            }
        });

    }

    handleSubmit = (event) => {
        event.preventDefault();
        const restaurantId = this.props.match.params.id;
        console.log("inside submit");
        this.state.ids.map(data => console.log(data));
        const menuIds = { menus: this.state.ids };

        API.upadateRestaurant(restaurantId, menuIds).then(response => {
            console.log("Response from submit" + response.data);
            this.props.history.push("/restaurant/" + restaurantId);

        }).catch(err => console.log(err));

    }

    change = (event) => {
        const selectedValue = event.target.value;
        this.setState({
            menutype: selectedValue
        });
    }

    render() {
        /* if(!this.state.menuItems.length){
			return <MDSpinner className="spinner" size={100}/>
		} */
        return (
            <Container>
                <div className="half">
                    <h3 className="title">Restaurant Name</h3>

                    <h3 className="title">Menu Items</h3>

                    <form className="form" onSubmit={this.handleSubmit.bind(this)}>
                        <input
                            name="dishName"
                            placeholder="Item Name (required)"
                            value={this.state.dishName}
                            onChange={this.handleInputChange}
                        />

                        <textarea
                            rows="5"
                            name="description"
                            placeholder="Description (optional)"
                            value={this.state.description}
                            onChange={this.handleInputChange}
                            className="textare"
                        />

                        <select value={this.state.menutype ? this.state.menutype : "t"} onChange={e => this.change(e)}>
                            <option value="t">Type...</option>
                            {this.state.types.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <div id="price">
                            <span>$</span>
                            <input
                                id="priceInput"
                                name="price"
                                placeholder="Price (required)"
                                value={this.state.price}
                                onChange={this.handleInputChange}
                            />
                        </div>  

                        <input
                            className="fileUpload"
                            type="file"
                            name="selectedFile"
                            onChange={this.handleInputChange}
                        />

                        <div id="addDone">
                            {this.state.isEdit ? (
                                <button id="updateItem" value={this.state.updateId} onClick={this.updateMenuItem.bind(this)}>Update Item</button>
                            ) : (
                                    <button id="addItem" onClick={this.addMenuItem.bind(this)}>Add Item</button>
                                )}
                            <button id="done" type="submit">I'm Done</button>
                        </div>
                    </form>
                </div>

                <div className="half">
                    <h3 className="title">Added Items</h3>

                    {this.state.menuItems.length ? (
                        <div id="addedMenu">
                            {this.state.menuItems.map(item => (
                                <div key={item._id}>
                                    <div className="menuButtons">
                                        <button className="delete" value={item._id} onClick={this.deleteMenuItem.bind(this)}>✗</button>
                                        <button className="edit" value={item._id} onClick={this.editMenuItem.bind(this)}>Edit</button>
                                    </div>
                                    <div className="menuItems">
                                        ${item.price} {item.dishName} | {item.menutype}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                            <h3>Add some menu items!</h3>
                        )}
                </div>
            </Container >
        )
    }
};

export default MenuEdit;