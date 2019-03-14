import React, { Component } from 'react';

class HashtagTop extends React.Component {
    constructor(props){
        super(props);
        debugger;
        this.state = {
            posts: props.items
        }

        this.formatTags = this.formatTags.bind(this);    
    };
    
    formatTags() {
        var arr = [];
        this.state.posts.forEach(element => {
            arr.push(element.combinedTags)
        });
        return arr;
    }
    
    render() {
        var tagsList = this.formatTags();
        return (
            <div className="hashtagTop">
                <ul>
                    {
                     tagsList.map(function(item, i){
                        return <li key={i}><a href="#{i}">#{item}</a></li>
                      })
                    }
                </ul>
            </div>
        );
    }
}
    
export default HashtagTop;


