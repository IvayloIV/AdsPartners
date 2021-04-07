import React, { Component } from 'react';
import traverson from 'traverson';
import JsonHalAdapter from 'traverson-hal';
import SliderBox from '../common/SliderBox';

export default class HomePage extends Component {
    render() {
        let data = ["Test1", "Test2", "Test3", "Test4", "Test5", "Test6", "Test7", "Test8", "Test9",
            "Test10", "Test11", "Test12", "Test13", "Test14", "Test15", "Test16", "Test17", "Test18", "Test19", "Test20"];
        let boxes = data.map(d => <span>{d}</span>);

		traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
		
        /*traverson.from('http://localhost:8080/api')
            .follow('ingredients')
			.post({ "id": "12", "name": "Ing12", "type": "MEAT"}, (err, res) => {
				console.log(err);
				console.log(res);
			});*/

        return (
            <div className="container">
                <h1>Home Page</h1>
                <p>Welcome to our site.</p>
                <SliderBox boxes={boxes}></SliderBox>
				<img src="http://res.cloudinary.com/dbeoyblgx/image/upload/v1616622734/zhhvlwe9yqwrlsvuhmzh.png"/>
            </div>
        );
    }
}