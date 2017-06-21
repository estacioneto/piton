(function () {
    'use strict';

    describe('ArchiveControllerTest', function () {

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
                return $controller('ArchiveController', {
                    $scope: scope,
                    $state: self.$state,
                    NoteService: NoteService,
                    ModalService: _ModalService_,
                    AuthService: AuthService
                });
            };

            self.$httpBackend.whenGET('./view/login.html').respond([]);
            self.$httpBackend.whenGET('./view/archive.html').respond([]);
            self.$httpBackend.whenGET('/api/notes').respond([NoteMock.get(), NoteMock.get(), NoteMock.get()]);
        }));


        describe('makeActive deve', function () {

            var authenticatedStub;
            beforeEach(function () {
                authenticatedStub = sinon.stub(AuthService, 'isAuthenticated', function () { return true; });
            });


            it('desarquivar uma nota corretamente', function () {
                var note = NoteMock.get();
                note.active = false;
                self.$httpBackend.expectGET('/api/notes').respond([note]);

                var controller = createController();
                self.$httpBackend.flush();
                expect(controller.getNotes()).to.exist;
                expect(controller.getNotes()).to.not.be.empty;
                expect(controller.getNotes()).to.have.length(1);

                var promise = controller.makeActive(controller.getNotes()[0]);
                expect(controller.getNotes()[0].active).to.be.equals(true);
            });
        });



    });
} ());