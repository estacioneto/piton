(function () {
    'use strict';

    describe('NoteControllerTest', function () {

        beforeEach(module('pitonApp', 'stateMock', 'Mocks'));

        var createController, scope, NoteService, NoteMock, ModalService, NoteFactory;
        var self = this;

        beforeEach(inject(defaultInjections(self)));
        // afterEach(defaultAfterEach(self));

        beforeEach(inject(function (_NoteService_, _NoteMock_, _$rootScope_, $controller, _ModalService_, _Note_) {
            NoteService = _NoteService_;
            NoteMock = _NoteMock_;
            scope = _$rootScope_.$new();
            ModalService = _ModalService_;
            NoteFactory = _Note_;

            createController = function (note, tempNote, availableTags) {
                return $controller('NoteController', {
                    $scope: scope,
                    NoteService: NoteService,
                    ModalService: ModalService,
                    $uibModalInstance: self.modalInstanceMock,
                    _note_: note || NoteMock.get(),
                    _tempNote_: tempNote,
                    _availableTags_: availableTags
                });
            };

            self.$httpBackend.whenGET('./view/login.html').respond([]);
        }));

        describe('openColorMenu deve', function () {
            it('chamar o callback com o parâmetro corretamente', function () {
                var controller = createController();
                var callbackStub = sinon.spy(function(ata){});
                var fakeParam = "hehehehhe";

                controller.openColorMenu(callbackStub, fakeParam);
                expect(callbackStub.called).to.be.true;
                expect(callbackStub.calledWith(fakeParam)).to.be.true;                
            });
        });

        describe('getNote deve', function () {
            it('recuperar a nota corretamente', function () {
                var controller = createController(NoteMock.get());

                var nota = controller.getNote();
                expect(nota).to.exist;
                expect(nota.title).to.exist;
                expect(nota.title).not.to.be.empty;
            });
        });

        describe('save deve', function () {
            it('salvar uma nota com sucesso corretamente', function (done) {
                self.$httpBackend.expectPATCH('/api/notes/1').respond({});
                var controller = createController();
                var saveSpy = sinon.spy(NoteFactory.prototype, 'save');
                var modalSpy = sinon.stub(ModalService, 'error', function () { });

                expect(controller.note).to.exist;
                expect(controller.note._id).to.exist;

                controller.save().should.be.fulfilled.then(function () {
                    expect(saveSpy.called).to.be.true;
                    expect(modalSpy.called).to.be.false;
                }).should.notify(done);
                self.$httpBackend.flush();
            });

            it('criar uma nota com sucesso corretamente', function (done) {
                self.$httpBackend.expectPOST('/api/notes').respond({});
                var controller = createController();
                controller.tempNote._id = undefined;
                var saveSpy = sinon.spy(NoteFactory.prototype, 'save');
                var modalSpy = sinon.stub(ModalService, 'error', function () { });

                expect(controller.note).to.exist;
                controller.save().should.be.fulfilled.then(function () {
                    expect(saveSpy.called).to.be.true;
                    expect(modalSpy.called).to.be.false;
                }).should.notify(done);
                self.$httpBackend.flush();
            });

            it('mostrar modal de erro ao não conseguir salvar uma nota', function (done) {
                self.$httpBackend.expectPATCH('/api/notes/1').respond(400);
                var controller = createController();
                var saveSpy = sinon.spy(NoteFactory.prototype, 'save');
                var modalSpy = sinon.stub(ModalService, 'error', function () { });

                expect(controller.note).to.exist;
                controller.save().should.be.rejected.then(function () {
                    expect(saveSpy.called).to.be.true;
                    expect(modalSpy.called).to.be.true;
                }).should.notify(done);
                self.$httpBackend.flush();
            });

            it('adicionar nova nota ao service corretamente', function (done) {
                self.$httpBackend.expectPOST('/api/notes').respond({});
                var note = NoteMock.get();
                note._id = undefined;
                var controller = createController(note);
                var saveSpy = sinon.spy(NoteFactory.prototype, 'save');
                var modalSpy = sinon.stub(ModalService, 'error', function () { });
                var nNotas = NoteService.notes.length;

                expect(controller.note).to.exist;
                controller.save().should.be.fulfilled.then(function () {
                    expect(saveSpy.called).to.be.true;
                    expect(modalSpy.called).to.be.false;
                    expect(nNotas + 1).to.be.equals(NoteService.notes.length);
                }).should.notify(done);
                self.$httpBackend.flush();
            });

            it('salvar uma nota e copiar os dados novos para a referência passada corretamente', function (done) {
                self.$httpBackend.expectPATCH('/api/notes/1').respond({});
                var myNote = NoteMock.get();
                var controller = createController(myNote);
                var saveSpy = sinon.spy(NoteFactory.prototype, 'save');
                var modalSpy = sinon.stub(ModalService, 'error', function () { });

                var tempNote = controller.getNote();

                expect(myNote._id).to.exist;
                expect(tempNote.title).to.be.equals(myNote.title);

                tempNote.title = "Meu titulo novo" + new Date().getTime();

                expect(tempNote.title).to.not.be.equals(myNote.title);

                controller.save().should.be.fulfilled.then(function () {
                    expect(saveSpy.called).to.be.true;
                    expect(modalSpy.called).to.be.false;

                    expect(tempNote.title).to.be.equals(myNote.title);
                }).should.notify(done);
                self.$httpBackend.flush();
            });

            it('não alterar nota ao falhar em atualizar', function (done) {
                self.$httpBackend.expectPATCH('/api/notes/1').respond(400);
                var myNote = NoteMock.get();
                var controller = createController(myNote);
                var saveSpy = sinon.spy(NoteFactory.prototype, 'save');
                var modalSpy = sinon.stub(ModalService, 'error', function () { });

                var oldTitle = myNote.title;
                var tempNote = controller.getNote();

                expect(myNote._id).to.exist;
                expect(tempNote.title).to.be.equals(myNote.title);

                tempNote.title = "Meu titulo novo" + new Date().getTime();

                expect(tempNote.title).to.not.be.equals(myNote.title);

                controller.save().should.be.rejected.then(function () {
                    expect(saveSpy.called).to.be.true;
                    expect(modalSpy.called).to.be.true;

                    expect(oldTitle).to.be.equals(myNote.title);
                }).should.notify(done);
                self.$httpBackend.flush();
            });
        });

        describe('getTodoInputStyle should', function () {
            it('return the property "text-decoration" properly if the todo is done', function () {
                var controller = createController(NoteMock.get());

                var nota = controller.getNote();
                var secondIndex = 1;
                expect(nota.todos[secondIndex].done).to.be.ok;
                var style = controller.getTodoInputStyle(secondIndex);
                expect(style).to.not.be.empty;
                expect(style['text-decoration']).to.be.equal('line-through');
            });

            it('return the property "text-decoration" properly if the todo is not done', function () {
                var controller = createController(NoteMock.get());

                var nota = controller.getNote();
                var firstIndex = 0;
                expect(nota.todos[firstIndex].done).to.not.be.ok;
                var style = controller.getTodoInputStyle(firstIndex);
                expect(style).to.be.empty;
                expect(style['text-decoration']).to.not.be.ok;
            });
        });

        describe('discard should', function () {
            it('not change a note when changes were made', function () {
                var controller = createController(NoteMock.get());
                var tempNote = controller.getNote();
                var realNote = angular.copy(controller.note);

                tempNote.title = 'Test title';

                assert.deepEqual(realNote, controller.note);

                controller.discard();
                assert.deepEqual(realNote, controller.note);
            });

            it('do nothing when no changes are made', function () {
                var controller = createController(NoteMock.get());
                var tempNote = controller.getNote();
                var oldNote = angular.copy(tempNote);
                var realNote = angular.copy(controller.note);

                assert.deepEqual(realNote, controller.note);
                assert.deepEqual(tempNote, oldNote);

                controller.discard();

                assert.deepEqual(realNote, controller.note);
                assert.deepEqual(tempNote, oldNote);
            });
        });

        describe('removeScheduling deve', function () {
            it('apagar corretamente as propriedades de agendamento', function () {
                var note = NoteMock.get();
                note.dateAndTime = "01/02/2017 06:90"
                note.scheduling = new Date();

                var controller = createController(note);
                expect(controller.getNote().scheduling).to.exist;
                expect(controller.getNote().dateAndTime).to.exist;

                controller.removeScheduling();

                expect(controller.getNote().scheduling).to.not.exist;
                expect(controller.getNote().dateAndTime).to.not.exist;
            });
        });

        describe('addTodo should', function () {

            it('create a new todo correctly', function () {
                var controller = createController(NoteMock.get());
                var note = controller.getNote();

                var firstIndex = 0;
                var secondIndex = 1;
                var numberOfTodos = 2;

                expect(note.todos[firstIndex]).to.exist;
                expect(note.todos[secondIndex]).to.exist;
                assert.equal(note.todos.length, numberOfTodos);

                controller.addTodo();

                expect(note.todos[firstIndex]).to.exist;
                expect(note.todos[secondIndex]).to.exist;
                expect(note.todos[secondIndex + 1]).to.exist;
                assert.equal(note.todos.length, numberOfTodos + 1);
            });
        });
    });
} ());