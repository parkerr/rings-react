import React, { PropTypes } from 'react';

class CircularProgressbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {poundsLost: this.props.poundsLost, percentage: props.initialAnimation ? 0 : props.percentage, items:[] };
  }

  componentDidMount() {
    if (this.props.initialAnimation) {
      this.initialTimeout = setTimeout(() => {
        this.requestAnimationFrame = window.requestAnimationFrame(() => {
          this.setState({
            percentage: this.props.percentage
          });
        });
      }, 0);
    }
	this.setState({...this.state, items: this.buildItems() })
  }

  buildItems(){
	  var items = []
	  var amountLeft = this.state.poundsLost
	  
	  for (var i = 1; i <= this.props.stones; i++) { 
		const radiusNum = (this.props.stones - i + 2) * 10
		const radius = (radiusNum - this.props.strokeWidth / 2);
		const pathDescription = `M 50,50 m 0,-${radius} a ${radius},${radius} 0 1 1 0,${2 * radius} a ${radius},${radius} 0 1 1 0,-${2 * radius}`;
		const diameter = Math.PI * 2 * radius;
		
		var amount = amountLeft / 14 >= 1 ? 100 : (amountLeft  / 14) * 100
		
		//Default the amount to 0 when negative
		if(amountLeft <= 0){amount = 0}
		
		const progressStyle = {
			strokeDasharray: `${diameter}px ${diameter}px`,
			strokeDashoffset: `${((100 - amount) / 100 * diameter)}px`,
		};	
		
		amountLeft = amountLeft - 14
		items[i] = ({progressStyleVal:progressStyle, pathDescriptionVal:pathDescription});
	
	} 
	  
	  return items
	  
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({...this.state, poundsLost: nextProps.poundsLost, items: this.buildItems()});
  }

  componentWillUnmount() {
    clearTimeout(this.initialTimeout);
    window.cancelAnimationFrame(this.requestAnimationFrame);
  }

  render() {
	  
	

    return (
      <svg
        className={`CircularProgressbar ${this.props.classForPercentage ? this.props.classForPercentage(this.props.percentage) : ''}`}
        viewBox="0 0 300 150"
      >
	  
	  {this.state.items.map((item, i) => {
			return(<path
          key={i} className="CircularProgressbar-trail"
          d={item.pathDescriptionVal}
          strokeWidth={this.props.strokeWidth}
          fillOpacity={0}
        />)
			
			
	  })}

	  {this.state.items.map((item, i) => {
			return(<path
          key={i} className="CircularProgressbar-path"
          d={item.pathDescriptionVal}
          strokeWidth={this.props.strokeWidth}
          fillOpacity={0}
          style={item.progressStyleVal}
        />)
			
			
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