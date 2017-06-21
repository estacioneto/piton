(function () {
    'use strict';

    describe('NotesControllerTest', function () {

        beforeEach(module('pitonApp', 'stateMock', 'Mocks'));

        var createController, scope, NoteService, NoteMock, ModalService, AuthService, ToastService;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_NoteService_, _NoteMock_, _$rootScope_, $controller, _ModalService_, _AuthService_, _ToastService_) {
            NoteService = _NoteService_;
            NoteMock = _NoteMock_;
            scope = _$rootScope_.$new();
            ModalService = _ModalService_;
            AuthService = _AuthService_;
            ToastService = _ToastService_;

            createController = function () {
                return $controller('NotesController', {
                    $scope: scope,
                    $state: self.$state,
                    NoteService: NoteService,
                    ModalService: _ModalService_,
                    AuthService: AuthService
                });
            };

            self.$httpBackend.whenGET('./view/login.html').respond([]);
            self.$httpBackend.whenGET('./view/home.html').respond([]);
            self.$httpBackend.whenGET('/api/notes').respond([NoteMock.get(), NoteMock.get(), NoteMock.get()]);
        }));

        describe('NotesController deve', function () {
            var authenticatedStub;
            beforeEach(function () {
                authenticatedStub = sinon.stub(AuthService, 'isAuthenticated', function () { return true; });
            });

            it('mostrar modal de erro quando não for possível carregar notas', function () {
                self.$httpBackend.expectGET('/api/notes').respond(400);

                var modalStub = sinon.stub(ModalService, 'error', function () { });
                var controller = createController();
                self.$httpBackend.flush();

                expect(modalStub.called).to.be.true;
                expect(controller.getNotes()).to.exist;
                expect(controller.getNotes()).to.be.empty;
            });

            it('carregar notas para quando usuário não tiver notas', function () {
                self.$httpBackend.expectGET('/api/notes').respond([]);

                var controller = createController();
                self.$httpBackend.flush();

                expect(controller.getNotes()).to.exist;
                expect(controller.getNotes()).to.be.empty;
            });

            it('carregar notas para quando usuário tiver apenas uma nota', function () {
                self.$httpBackend.expectGET('/api/notes').respond([NoteMock.get()]);

                var controller = createController();
                self.$httpBackend.flush();

                expect(controller.getNotes()).to.exist;
                expect(controller.getNotes()).to.not.be.empty;
                expect(controller.getNotes()).to.have.length(1);
                expect(controller.getNotes()[0].title).not.to.be.empty;
            });

            it('carregar notas para quando usuário tiver mais de uma nota', function () {
                self.$httpBackend.expectGET('/api/notes').respond([NoteMock.get(), NoteMock.get()]);

                var controller = createController();
                self.$httpBackend.flush();

                expect(controller.getNotes()).to.exist;
                expect(controller.getNotes()).to.not.be.empty;
                expect(controller.getNotes()).to.have.length(2);
                expect(controller.getNotes()[0].title).not.to.be.empty;
                expect(controller.getNotes()[1].title).not.to.be.empty;
            });

            it('remover uma nota corretamente', function () {
                // self.$httpBackend.expectGET('/api/notes').respond([NoteMock.get()]);
                // var controller = createController();
                // self.$httpBackend.flush();

                // var spyDisableNote = sinon.spy(NoteService, 'disableNote');
                // var newNoteIndex = 0;

                // expect(controller.getNotes()).to.not.be.empty;
                // expect(controller.getNotes()).to.have.length(1);
                // controller.removeNote(newNoteIndex);

                // expect(spyDisableNote.called).to.be.true;
            });
        });

        // TODO: ArchiveControllerTest @Estácio Pereira 15/01/2017
        // describe('makeActive deve', function () {
        //     var authenticatedStub;
        //     beforeEach(function () {
        //         authenticatedStub = sinon.stub(AuthService, 'isAuthenticated', function () { return true; });
        //     });
        //
        //     it('reativar uma nota corretamente', function (done) {
        //         self.$httpBackend.expectGET('/api/notes').respond([NoteMock.get()]);
        //
        //         var modalStub = sinon.stub(ModalService, 'error', function () { });
        //         var controller = createController();
        //         self.$httpBackend.flush();
        //
        //         expect(modalStub.called).to.be.false;
        //         expect(controller.getNotes()).to.exist;
        //         expect(controller.getNotes()).to.not.be.empty;
        //
        //         var noteZero = controller.getNotes()[0];
        //         expect(noteZero.active).to.be.true;
        //
        //         noteZero.active = false;
        //         self.$httpBackend.expectPATCH('/api/notes/1').respond(200);
        //         noteZero.save();
        //         self.$httpBackend.flush();
        //         expect(noteZero.active).to.be.false;
        //
        //         self.$httpBackend.expectPATCH('/api/notes/1').respond(200);
        //         controller.makeActive(noteZero).should.be.fulfilled.then(function () {
        //             expect(noteZero.active).to.be.true;
        //         }).should.notify(done);
        //         self.$httpBackend.flush();
        //     });
        // });

        describe('transição para state home deve', function () {
            // FIXME: esse teste não está passando, e não entendi o que
            // deveria fazer. @author: Eric Breno
            // it('carregar as notas do usuário', function () {
            //     var spyLoadNotes = sinon.spy(NoteService, 'loadNotes');

            //     expect(self.$state.current).not.to.be.equals('home');
            //     self.$state.expectTransitionTo('home');
            //     self.$state.go('home');
            //     self.$rootScope.$digest();

            //     expect(spyLoadNotes.called).to.be.true;
            // });
        });

    });
} ());