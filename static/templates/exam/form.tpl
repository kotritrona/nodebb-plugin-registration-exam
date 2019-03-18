<form role="form" class="exam-form">
    <div class="exam-questions">
        <!-- BEGIN questions -->
        <div class="exam-question col-md-12 col-xs-12" id="exam-question-{questions.n}">
            <div class="exam-question-title"><h4>{questions.q}</h4></div>
            <!-- IF questions.c.length -->
            <!-- BEGIN questions.c -->
            <div class="exam-question-option btn btn-default">{questions.c}</div>
            <!-- END questions.c -->
            <!-- ENDIF questions.c.length -->
            <!-- IF !questions.c.length -->
            <input class="exam-question-input form-control" type="text" value="" />
            <!-- ENDIF !questions.c.length -->
            <!-- IF !@first -->
            <div class="exam-prev btn btn-primary col-md-3 col-xs-5">[[exam:prev]]</div>
            <!-- ENDIF !@first -->
            <!-- IF !@last -->
            <div class="exam-next btn btn-primary col-md-3 col-xs-5">[[exam:next]]</div>
            <!-- ENDIF !@last -->
            <!-- IF @last -->
            <div class="exam-submit btn btn-primary col-md-3 col-xs-5">[[exam:submit]]</div>
            <!-- ENDIF @last -->
        </div>
        <!-- END questions -->
    </div>
</form>