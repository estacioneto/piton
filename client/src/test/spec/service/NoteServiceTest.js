(function () {
    'use strict';

    describe('NoteServiceTest', function () {

        beforeEach(module('pitonApp', 'stateMock', 'Mocks'));

        var NoteService, NoteMock, NoteFactory, ModalService;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_NoteService_, _NoteMock_, _Note_, _ModalService_) {
            NoteService = _NoteService_;
            NoteMock = _NoteMock_;
            NoteFactory = _Note_;
            ModalService = _ModalService_;
        }));


        describe('disableNote should', function () {
            it('disable a note if it is active', function (done) {
                self.$httpBackend.expectGET('/api/notes').respond([NoteMock.get()]);

                NoteService.loadNotes();
                self.$httpBackend.flush();
                var saveSpy = sinon.spy(NoteFactory.prototype, 'save');
                var nota = NoteService.notes[0];
                expect(nota.active).to.equals(true);
                self.$httpBackend.expectPATCH(self.$rootScope.apiRoot + '/notes/1').respond({});

                var promise = NoteService.disableNote(nota);

                promise.should.be.fulfilled.then(function (data) {
                    expect(NoteService.notes).to.not.be.empty;
                    expect(NoteService.notes).to.have.length(1);
                    expect(NoteService.notes[0].active).to.equals(false);
                    expect(saveSpy.called).to.be.true;
                }).should.notify(done);

                self.$httpBackend.flush();
            });

            it('call modal with error in deleting a note', function (done) {
                var erroStub = sinon.stub(ModalService, 'error', function(){});
                var note = NoteMock.get();
                note.active = false;
                self.$httpBackend.expectPATCH(self.$rootScope.apiRoot + '/notes/1').respond(400);
                
                var promise = NoteService.disableNote(note);

                promise.should.be.rejected.then(function () {
                    expect(erroStub.called).to.be.true;
                }).should.notify(done);

                self.$httpBackend.flush();
            });

            it('call modal with error in archiving a note', function(done){
                var erroStub = sinon.stub(ModalService, 'error', function(){});
                var note = NoteMock.get();
                note.active = true;
                self.$httpBackend.expectPATCH(self.$rootScope.apiRoot + '/notes/1').respond(400);
                
                var promise = NoteService.disableNote(note);

                promise.should.be.rejected.then(function () {
                    expect(erroStub.called).to.be.true;
                }).should.notify(done);

                self.$httpBackend.flush();
            });
        });

        describe('deleteNote should', function () {
            it('delete a note if it is active', function (done) {
                var note = NoteMock.get();
                note.active = true;
                self.$httpBackend.expectGET('/api/notes').respond([note]);

                var promise = NoteService.loadNotes();

                promise.should.be.fulfilled.then(function (data) {
                    var nota = data.data[0];
                    expect(nota.active).to.equals(true);
                    expect(NoteService.notes[0].active).to.equals(true);

                    self.$httpBackend.expectDELETE(self.$rootScope.apiRoot + '/notes/1').respond({});
                    return NoteService.deleteNote(nota);

                }).then(function () {
                    expect(NoteService.notes).to.be.empty;
                    expect(NoteService.notes).to.have.length(0);
                }).should.notify(done);

                self.$httpBackend.flush();
            });

            it('delete a note if it is inactive', function (done) {
                var note = NoteMock.get();
                note.active = false;
                self.$httpBackend.expectGET('/api/notes').respond([note]);

                var promise = NoteService.loadNotes();

                promise.should.be.fulfilled.then(function (data) {
                    var nota = data.data[0];
                    expect(nota.active).to.equals(false);
                    expect(NoteService.notes[0].active).to.equals(false);

                    self.$httpBackend.expectDELETE(self.$rootScope.apiRoot + '/notes/1').respond({});
                    return NoteService.deleteNote(nota);

                }).then(function () {
                    expect(NoteService.notes).to.be.empty;
                    expect(NoteService.notes).to.have.length(0);
                }).should.notify(done);

                self.$httpBackend.flush();
            });
        });

        describe('loadNotes deve', function () {
            it('carregar notas para quando usuário não tiver notas', function (done) {
                self.$httpBackend.expectGET('/api/notes').respond([]);

                var promise = NoteService.loadNotes("1");
                promise.should.be.fulfilled.then(function (data) {
                    expect(data.status).to.be.equal(200);
                    expect(data.data).to.exist;
                    expect(data.data).to.be.empty;
                }).should.notify(done);

                self.$httpBackend.flush();
            });

            it('carregar notas para quando usuário tiver apenas uma nota', function (done) {
                self.$httpBackend.expectGET('/api/notes').respond([NoteMock.get()]);

                var promise = NoteService.loadNotes("1");
                promise.should.be.fulfilled.then(function (data) {
                    expect(data.status).to.be.equal(200);
                    expect(data.data).to.exist;
                    expect(data.data).to.not.be.empty;
                    expect(data.data).to.have.length(1);
                    expect(data.data[0].title).not.to.be.empty;
                }).should.notify(done);

                self.$httpBackend.flush();
            });

            it('carregar notas para quando usuário tiver mais de uma nota', function (done) {
                self.$httpBackend.expectGET('/api/notes').respond([NoteMock.get(), NoteMock.get()]);
                var promise = NoteService.loadNotes("1");

                promise.should.be.fulfilled.then(function (data) {
                    expect(data.status).to.be.equal(200);
                    expect(data.data).to.exist;
                    expect(data.data).to.not.be.empty;
                    expect(data.data).to.have.length(2);
                    expect(data.data[0].title).not.to.be.empty;
                    expect(data.data[1].title).not.to.be.empty;
                }).should.notify(done);

                self.$httpBackend.flush();
            });
        });
    });
} ());