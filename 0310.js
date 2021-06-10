var canvas = document.getElementById("example");
var ctx = canvas.getContext("2d");
var ctx_h = canvas.height;
var ctx_w = canvas.width;
var particles_row = 0;
var particles_col = 3;
var particle_rad = 10;
var scale = 100;
particles = [];
path = 10;
var particle_bound = 50;
var field_length = 2;

var particles_prop = []
function Main(){
	set_value(500, 300, -1);
	set_value(1400, 600, 1);
	for (i = 0; i < 2; i++){
		set_value(particle_bound/2 + Math.ceil(Math.random()*(ctx_w-particle_bound)), particle_bound/2 + Math.ceil(Math.random()*(ctx_h-particle_bound)), 1);	
	}
	
	for (i = 0; i < 2; i++){
		set_value(particle_bound/2 + Math.ceil(Math.random()*(ctx_w-particle_bound)), particle_bound/2 + Math.ceil(Math.random()*(ctx_h-particle_bound)), -1);	
	}

	inner_angle = 0;
	var id = setInterval(frame, 10);
	inner_x_1_0 = 500;
	inner_y_1_0 = 300;
	inner_x_2_0 = 1100;
	inner_y_2_0 = 600;
	function frame(){
		inner_x_1 = inner_x_1_0+Math.cos(inner_angle/720*Math.PI)*400;
		inner_y_1 = inner_y_1_0+Math.sin(inner_angle/720*Math.PI)*200;
		inner_x_2 = inner_x_2_0-Math.cos(inner_angle/720*Math.PI)*600;
		inner_y_2 = inner_y_2_0+Math.sin(inner_angle/720*Math.PI)*300;
		particles[0] = inner_x_1;
		particles[1] = inner_y_1;
		particles[3] = inner_x_2;
		particles[4] = inner_y_2;
		draw_frame();
		draw_all();
		draw_particles();
		ctx.closePath();
		inner_angle++;
	}
}

function draw_all(){
	for (inner_lol = 0; inner_lol < particles_row; inner_lol++){
		particle_plus = get_particle(inner_lol);
		console.log(inner_lol);
		for (angle_degr = 0; angle_degr < 36; angle_degr++){
			angle_rad = angle_degr*10/180*Math.PI;
			coord_st = new Vector2D(particle_plus[0] + particle_rad*Math.cos(angle_rad), particle_plus[1] + particle_rad*Math.sin(angle_rad));
			ctx.beginPath();
			ctx.moveTo(coord_st.x, coord_st.y);
			go = true;
			while (go){
				coord_st = add_vector(coord_st, field_at_point(coord_st, particle_plus[2]));
				ctx.lineTo(coord_st.x, coord_st.y);
				go = allowed(coord_st);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
}

function allowed(point){
	let out = true;
	for (i = 0; i < particles_row; i++){
		point_in = get_particle(i);
		if ((point_in[0] - point.x)**2 + (point_in[1] - point.y)**2 < field_length**2){
			out = false;
		}
	}
	if (point.x > ctx_w	|| point.x < 0 || point.y > ctx_h || point.y < 0){
		out = false;
	}
	return out;
}

function draw_frame(){
	ctx.clearRect(0, 0, ctx_w, ctx_h);
	ctx.rect(0, 0, ctx_w, ctx_h);
	ctx.stroke();
}

function draw_particles(){
	for (i = 0; i < particles_row; i++){
		point = get_particle(i);
		ctx.beginPath();
		ctx.arc(point[0], point[1], particle_rad, 0, 2 * Math.PI, false);
		if (point[2] == 1){
		ctx.fillStyle = 'red';	
		} else {
		ctx.fillStyle = 'blue';	
		}	
		ctx.fill();
	} 
}

function get_particle(id){
	return [get_value(id, 0), get_value(id, 1), get_value(id, 2)]
}

function get_value(row, col){
	return particles[particles_col*row + col]
}

function set_value(x, y, charge){
	particles.push(x);
	particles.push(y);
	particles.push(charge);
	particles_row++;
}

function field(id, point){
	inner = get_particle(id);
	vec = new Vector2D(point.x - inner[0], point.y - inner[1]);
	power = inner[2]/(vec.x**2 + vec.y**2);
	return new Vector2D(power*vec.x/Math.sqrt(vec.x**2 + vec.y**2), power*vec.y/Math.sqrt(vec.x**2 + vec.y**2));
	
}

function field_at_point(point, mult){
	inner_vec = new Vector2D(0, 0);
	for (i = 0; i < particles_row; i++){
		inner_vec = add_vector(inner_vec, field(i, point));
	}
	return new Vector2D(mult*field_length*inner_vec.x/Math.sqrt(inner_vec.x**2 + inner_vec.y**2), mult*field_length*inner_vec.y/Math.sqrt(inner_vec.x**2 + inner_vec.y**2));
}

class Vector2D{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

function add_vector(v1, v2){
	return new Vector2D(v1.x + v2.x, v1.y +  v2.y);	
}

function wait(ms){
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);
}