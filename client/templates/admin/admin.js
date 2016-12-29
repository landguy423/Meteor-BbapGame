/*****************************************************************************/
/* Admin: Event Handlers */
/*****************************************************************************/
Template.Admin.events({
});

/*****************************************************************************/
/* Admin: Helpers */
/*****************************************************************************/
Template.AdminPreguntas.helpers({

  questions: function() { 
    return Questions.find(); 
  }

  // beforeRemove: function () {
  //   return function (collection, id) {
  //         var doc = collection.findOne(id);
  //         if (confirm('Estas seguro de eliminar la pregunta "' + doc.question + '"?')) {
  //           this.remove();
  //           Router.go('admin');
  //         }
  //       }
  //    }    

});

Template.AdminPreguntasEditar.helpers({

  categories: function() { 
    return Categories.find(); 
  }

});


Template.AdminCategorias.helpers({

  categories: function() {
      return Categories.find();
    }

});


Template.AdminCategorias.events({

  'click #add': function() {


     Categories.insertTranslations({
        category: 'question',
        description: 'Meteor.userId()',
        short: 'category',
        icon: 'icon',
      },
      { en:{
          category: 'ENNN',
          description: 'answers EN',
          short: 'category EN',
        }
      }, function(err, result) {

       if(err){
        console.log(err);
       }

     });

    },

    'click .borrar' : function(e){

      e.preventDefault();

      if (confirm('Estas seguro de eliminar la categoria?')) {
          Categories.remove( $(e.currentTarget).data('id'));
      }
    }

});

Template.AdminPreguntasEditar.events({

   'click .select' : function (e) {
      e.preventDefault();
       $(e.currentTarget).next().toggleClass('hide');
    },

    'click .options li' : function (e) {
      e.preventDefault();

      var $this = $(e.currentTarget), selector =  $this.closest('.custom-select');

      selector.find('input[type="hidden"]').val($this.data('id'));
      selector.find('.selection').text($this.text());

      if(selector.find('.options').hasClass('hide')){
        selector.find('.options').removeClass('hide');
      }else{
        $('.options').addClass('hide');
      }
      
    },

   'submit form' : function (e) {
    e.preventDefault();

      var questionCategory = $('input[name="question.category"]').val(),
          questionStatus = $('input[name="question.status"]').val(),
          questionLevel = $('input[name="question.level"]').val(),          
          questionEs= $('input[name="question.es.question"').val(),
          questionEsAnswersCorrecta = $('input[name="question.es.answers.correcta"').val(),
          questionEsAnswersIncorrecta1 = $('input[name="question.es.answers.incorrecta1"').val(),
          questionEsAnswersIncorrecta2 = $('input[name="question.es.answers.incorrecta2"').val(),
          questionEsAnswersIncorrecta3 = $('input[name="question.es.answers.incorrecta3"').val(),
          questionEn= $('input[name="question.en.question"').val(),
          questionEnAnswersCorrecta = $('input[name="question.en.answers.correcta"').val(),
          questionEnAnswersIncorrecta1 = $('input[name="question.en.answers.incorrecta1"').val(),
          questionEnAnswersIncorrecta2 = $('input[name="question.en.answers.incorrecta2"').val(),
          questionEnAnswersIncorrecta3 = $('input[name="question.en.answers.incorrecta3"').val(),

          answersEs = { correcta: questionEsAnswersCorrecta, incorrecta1: questionEsAnswersIncorrecta1,incorrecta2: questionEsAnswersIncorrecta2, incorrecta3: questionEsAnswersIncorrecta3 },
          answersEn = { correcta: questionEnAnswersCorrecta, incorrecta1: questionEnAnswersIncorrecta1,incorrecta2: questionEnAnswersIncorrecta2, incorrecta3: questionEnAnswersIncorrecta3 };
   
     Questions.updateTranslations(this.es._id,
      { es: {
        question: questionEs,
        answers: answersEs,
        category: questionCategory,
        status: questionStatus,
        level : questionLevel,
        reviewedAt : Date.now()
      },
        en:{
        question: questionEn,
        answers: answersEn,
        }
      }, function(err, result) {

           if(err){
            console.log(err);
           }
           else{
            Router.go('admin.preguntas');
           }

     });


    }  
});


Template.AdminCategoriasEditar.events({

   'click .select' : function (e) {
      e.preventDefault();
      $('.options').toggleClass('hide');
    },

    'click .options li' : function (e) {
      e.preventDefault();
      $('#category').val($(e.currentTarget).data('id'));
      $('.selection').text($(e.currentTarget).text());
      $('.options').toggleClass('hide');
    },

   'submit form' : function (e) {
    e.preventDefault();

      var categoryIcon = $('input[name="category.icon"]').val(),
          categoryColor = $('input[name="category.color"]').val(),
          categoryEsCategory = $('input[name="category.es.category"]').val(),
          categoryEsDescription = $('textarea[name="category.es.description"]').val(),
          categoryEsShort = $('input[name="category.es.short"]').val(),
          categoryEnCategory = $('input[name="category.en.category"]').val(),
          categoryEnDescription = $('textarea[name="category.en.description"]').val(),
          categoryEnShort = $('input[name="category.en.short"]').val();      

          console.log(categoryColor);

// Categories.update(this.es._id, {$unset: {color: 1}}, function(error, result) {

//   if(error){
//     console.log(error);
//   }

//   console.log(result);

// });

     Categories.updateTranslations(this.es._id,
      { es: {
        category: categoryEsCategory,
        description: categoryEsDescription,
        short: categoryEsShort,
        icon: categoryIcon,
        color: categoryColor,
      },
        en:{
          category: categoryEnCategory,
          description: categoryEnDescription,
          short: categoryEnShort,
        }
      }, function(err, result) {

           if(err){
            console.log(err);
           }
           else{
            Router.go('admin.categorias');
           }

     });


    }  
});



/*****************************************************************************/
/* Admin: Lifecycle Hooks */
/*****************************************************************************/
Template.Admin.onCreated(function () {
});

Template.Admin.onRendered(function () {
	//$('ul.tabs').tabs();

});

Template.Admin.onDestroyed(function () {
});

