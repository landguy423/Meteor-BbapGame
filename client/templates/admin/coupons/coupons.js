Template.AdminCoupons.events({
	'submit .new-coupon': function(e){
		e.preventDefault();
		const target = e.target;


		Meteor.call('generateUniqueCoupon',target.retry.value,target.vv.value,target.vp.value,function(error,data){
			if (error){
				console.log(error);
			}
			document.querySelector('.modal .modal-content').innerHTML = data;
			document.querySelector(".modal").classList.add('open');
			
		})
	},
	'click .modal' : function(){
		document.querySelector(".modal").classList.remove('open');
	}
})