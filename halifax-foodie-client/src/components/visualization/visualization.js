import React, {Component, PureComponent} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Header from "../headers/Header";
import "./visualization.css";
import axios from 'axios';
import { GET_ORDERS } from '../../config';
import {toast} from "react-toastify";


const data = [];

class Visualization extends PureComponent {

    constructor(props) {
        super(props);

        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.userEmail && user.secure) {
            this.props.location.isAuthenticated = true;
        } else {
            this.props.history.push({
                pathname: '/'
            });
        }

        this.state = {
            myOrders: [],
            data:data,
            selectedOrder: '',
            showModal: false
        }
    }

    componentDidMount = async () => {
        await this.getOrders();
    }
    
    getOrders = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
    
        await axios
            .get(GET_ORDERS + user.userEmail)
            .then((response) => {
                let orders = response.data.Items;
                let graphdata = [];
    
                let dataMap = {};
                orders.forEach((order) => {
                    let createdAt = order.createdAt;
                    let orderDate = createdAt.split("T")[0];
                    console.log(createdAt);
                    console.log(orderDate);
                    if (dataMap[orderDate]) {
                        dataMap[orderDate] = dataMap[orderDate] + 1;
                    } else {
                        dataMap[orderDate] = 1;
                    }
                });
                Object.entries(dataMap).forEach(([key, value]) => {
                    console.log(key, value);
                   graphdata.push({name: key, count: value});
                });
    
                console.log(graphdata);
                this.setState({
                    myOrders: orders,
                    data: graphdata
                });
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data);
            });
    }

    render() {
    return (
        <section>
            <Header isAuthenticated={true}/>
            <br/>
            <br/>
            <br/>
            <br/>
            <div>
            <ResponsiveContainer width="70%" aspect ={2}>
                <LineChart
                    width={500}
                    height={300}
                    data={this.state.data}
                    margin={{
                        top: 7,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/*<Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />*/}
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                    {/*<Line type="monotone" dataKey="uv" stroke="#82ca9d" />*/}
                </LineChart>
            </ResponsiveContainer>
            </div>
        </section>
    )
}
}

export default Visualization