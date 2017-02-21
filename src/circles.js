import React, { PropTypes } from 'react';

class CircularProgressbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {poundsLost: this.props.poundsLost};
  }


    
  componentWillReceiveProps(nextProps) {
    this.setState({...this.state, poundsLost:nextProps.poundsLost, items: []});
  }

  componentWillUnmount() {
    clearTimeout(this.initialTimeout);
    window.cancelAnimationFrame(this.requestAnimationFrame);
  }

  render() {
	  
	//Build the rings  
	var items = this.buildItems()

    return (
      <svg
        className={`CircularProgressbar ${this.props.classForPercentage ? this.props.classForPercentage(this.props.percentage) : ''}`}
        viewBox="0 0 300 300"
		height="600" width="600"
		 preserveAspectRatio="xMinYMin meet"
      >
	  //The main rings
	  {items.map((item, i) => {
			return(
				<path key={i} className="CircularProgressbar-trail"
				d={item.pathDescriptionVal}
				strokeWidth={this.props.strokeWidth}
				fillOpacity={0}/>
			)
		})}
		
		//The progress indicators
	  {items.map((item, i) => {
			return(
				<path key={i} className="CircularProgressbar-path"
				d={item.pathDescriptionVal}
				strokeWidth={this.props.strokeWidth}
				fillOpacity={0}
				style={item.progressStyleVal}/>
			)			
	  })}
	  
		
		
        <text
          className="CircularProgressbar-text"
          x={50}
          y={50}
        >
          
        </text>
      </svg>
    );
  }
  
  buildItems(){
	  var items = []
	  
	  //Store the amountLeft so we can use it for calculations in the loop below
	  var amountLeft = this.state.poundsLost
		
	  var loops = this.props.halfStone ? this.props.stones * 2 : this.props.stones	
	  var incrementLevel = this.props.halfStone ? 7 : 14
	  
	  //Add a ring per stone
	  for (var i = 1; i <= loops; i++) { 
	  
		//The first stone is the largest ring	
		const radiusNum = (loops - i + 2) * 10
		const radius = (radiusNum - this.props.strokeWidth / 2);
		//const pathDescription = `M 50,50 m 0,-${radius} a ${radius},${radius} 0 1 1 0,${2 * radius} a ${radius},${radius} 0 1 1 0,-${2 * radius}`;
		const position = (loops + 1) * 10
		const pathDescription = `M ${position},${position} m 0,-${radius} a ${radius},${radius} 0 1 1 0,${2 * radius} a ${radius},${radius} 0 1 1 0,-${2 * radius}`;

		
		const diameter = Math.PI * 2 * radius;
		
		var amount = amountLeft / incrementLevel >= 1 ? 100 : (amountLeft  / incrementLevel) * 100
		
		//Default the amount to 0 when negative
		if(amountLeft <= 0){amount = 0}
		
		const progressStyle = {
			strokeDasharray: `${diameter}px ${diameter}px`,
			strokeDashoffset: `${((100 - amount) / 100 * diameter)}px`,
		};	
		
		//Reduce the amount left
		amountLeft = amountLeft - incrementLevel
		
		//Add to the array
		items[i] = ({progressStyleVal:progressStyle, pathDescriptionVal:pathDescription});
	
	} 
	  
	  return items
	  
  }
  
  
}

CircularProgressbar.propTypes = {
  percentage: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number,
  initialAnimation: PropTypes.bool,
  classForPercentage: PropTypes.func,
  textForPercentage: PropTypes.func,
};

CircularProgressbar.defaultProps = {
  strokeWidth: 8,
  textForPercentage: (percentage) => `${percentage}%`,
  initialAnimation: false,
};

export default CircularProgressbar;