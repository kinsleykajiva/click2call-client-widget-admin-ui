

<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="page-header">
                <h1>Plugin Demo: Audio Room (mixed)
                    <button class="btn btn-default" autocomplete="off" id="start">Start</button>
                </h1>
            </div>
            <div class="container" id="details">
                <div class="row">
                    <div class="col-md-12">
                        <h3>Demo details</h3>
                        <p>The Audio Bridge demo is a simple example of how to implement
                            an audio conferencing application through Janus. Since it makes use
                            of the AudioBridge plugin, all the audio contributions will be mixed,
                            which means that a single PeerConnection will be created no matter
                            how many participants will join the room.</p>
                        <p>To try the demo, just insert a username to join the default audio
                            room that is configured. This will add you to the mixed audio conference.
                            A container on the left will display a list of the other participants
                            in the room as they join, with a simple indicator to inform you whether
                            they're muted or not. You can mute/unmute yourself using the icon that
                            will appear next to your name.</p>
                        <p>Press the <code>Start</code> button above to launch the demo.</p>
                    </div>
                </div>
            </div>
            <div class="container hide" id="audiojoin">
                <div class="row">
                    <span class="label label-info" id="you"></span>
                    <div class="col-md-12" id="controls">
                        <div class="input-group margin-bottom-md hide" id="registernow">
                            <span class="input-group-addon">@</span>
                            <input class="form-control" type="text" placeholder="Choose a display name" autocomplete="off" id="username" onkeypress="return checkEnter(this, event);" />
                            <span class="input-group-btn">
								<button class="btn btn-success" autocomplete="off" id="register">Join the room</button>
							</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container hide" id="room">
                <div class="row">
                    <div class="col-md-6">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title">Participants <span class="label label-info hide" id="participant"></span>
                                    <button class="btn-xs btn-danger hide pull-right" autocomplete="off" id="toggleaudio">Mute</button>
                                    <button class="btn-xs btn-primary hide pull-right" autocomplete="off" id="position">Position</button></h3>
                            </div>
                            <div class="panel-body">
                                <ul id="list" class="list-group">
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title">Mixed Audio</h3>
                            </div>
                            <div class="panel-body" id="mixedaudio"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <hr>
    <div class="footer">
    </div>
</div>
