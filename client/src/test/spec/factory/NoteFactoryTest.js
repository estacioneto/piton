(function () {
    'use strict';

    describe('NoteFactory test', function () {
        beforeEach(module('pitonApp', 'Mocks'));

        var NoteFactory, NoteMock;

        var self = this;

        beforeEach(inject(defaultInjections(this)));

        beforeEach(inject(function (_Note_, _NoteMock_) {
            NoteFactory = _Note_;
            NoteMock = _NoteMock_;

            self.$httpBackend.whenGET('./view/login.html').respond([]);
        }));


        describe('Construtor deve', function () {
            it('copiar corretamente os dados fornecidos', function () {
                var note = NoteMock.get();
                var noteFactory = new NoteFactory(note);

                expect(noteFactory._data['title']).to.equals('Generico');
                expect(noteFactory._data['textContent']).to.equals('Hum, muito bom');
                expect(noteFactory._data['scheduling']).to.be.empty;
                expect(noteFactory._data['todos']).to.not.be.empty;
                expect(noteFactory._data['todos']).to.have.length(2);
            });

            it('definir valor padrao quando nao forem fornecidos dados', function () {
                var note = NoteMock.get();
                var noteFactory = new NoteFactory();
                var defaultNoteColor = 'yellow-A100';

                expect(noteFactory._data['title']).to.exist;
                expect(noteFactory._data['title']).to.be.empty;
                expect(noteFactory._data['textContent']).to.exist;
                expect(noteFactory._data['textContent']).to.be.empty;
                expect(noteFactory._data['scheduling']).to.not.be.ok;
                assert.isNull(noteFactory._data['scheduling']);
                expect(noteFactory._data['todos']).to.exist;
                expect(noteFactory._data['todos']).to.be.empty;
                expect(noteFactory._data['tags']).to.exist;
                expect(noteFactory._data['tags']).to.be.empty;
                expect(noteFactory._data['active']).to.equals(true);
                expect(noteFactory._data['color']).to.equals(defaultNoteColor);
            });
        });

        describe('NoteFactory.title deve', function () {
            it('setar o titulo corretamente', function () {
               var noteFactory = new NoteFactory();
               expect(noteFactory.title).to.exist;
               expect(noteFactory.title).to.be.empty;
               expect(noteFactory._data['title']).to.exist;
               expect(noteFactory._data['title']).to.be.empty;

               noteFactory.title = 'NewTitle';

               expect(noteFactory._data['title']).to.exist;
               expect(noteFactory._data['title']).to.not.be.empty;
               expect(noteFactory._data['title']).to.equals('NewTitle');
            });

            it('get o titulo corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory.title).to.be.empty;

                noteFactory.title = 'NewTitle';

                expect(noteFactory.title).to.equals('NewTitle');
                expect(noteFactory.title).to.equals(noteFactory._data['title']);
            });

        });


        describe('NoteFactory._id deve', function () {
            it('setar o id corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory._id).to.be.undefined;
                expect(noteFactory._data['_id']).to.be.undefined;

                noteFactory._id = 100;

                expect(noteFactory._data['_id']).to.exist;
                expect(noteFactory._data['_id']).to.not.be.undefined;
                expect(noteFactory._data['_id']).to.equals(100);
            });

            it('get o id corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory._id).to.be.undefined;

                noteFactory._id = 100;

                expect(noteFactory._id).to.equals(100);
                expect(noteFactory._id).to.equals(noteFactory._data['_id']);
            });

        });

        describe('NoteFactory.textContent deve', function () {
            it('setar o textContent corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory.textContent).to.exist;
                expect(noteFactory._data['textContent']).to.be.empty;

                noteFactory.textContent = 'teste';

                expect(noteFactory._data['textContent']).to.exist;
                expect(noteFactory._data['textContent']).to.not.be.empty;
                expect(noteFactory._data['textContent']).to.equals('teste');
            });

            it('get o textContent corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory.textContent).to.exist;
                expect(noteFactory.textContent).to.be.empty;

                noteFactory.textContent = 'teste';

                expect(noteFactory.textContent).to.equals('teste');
                expect(noteFactory.textContent).to.equals(noteFactory._data['textContent']);
            });

        });

        describe('NoteFactory.todos deve', function () {
            it('setar os todos corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory.todos).to.exist;
                expect(noteFactory._data['todos']).to.be.empty;

                noteFactory.todos.push({
                    "title": "Primeiro todo",
                    "textContent": "Testando isto",
                    "done": true
                });

                expect(noteFactory._data['todos']).to.exist;
                expect(noteFactory._data['todos']).to.not.be.empty;
                expect(noteFactory._data['todos'][0].title).to.equals('Primeiro todo');
                expect(noteFactory._data['todos'][0].textContent).to.equals('Testando isto');
                expect(noteFactory._data['todos'][0].done).to.equals(true);
            });

            it('get os todos corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory.todos).to.exist;
                expect(noteFactory.todos).to.be.empty;

                noteFactory.todos.push({
                    "title": "Primeiro todo",
                    "textContent": "Testando isto",
                    "done": true
                });

                expect(noteFactory.todos).to.not.be.empty;
                expect(noteFactory.todos).to.have.length(1);
                expect(noteFactory.todos).to.equals(noteFactory._data['todos']);
            });

        });

        describe('NoteFactory.active deve', function () {
            it('setar a flag active corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory.active).to.equals(true);
                expect(noteFactory._data['active']).to.equals(true);

                noteFactory.active = false;

                expect(noteFactory.active).to.equals(false);
                expect(noteFactory._data['active']).to.equals(false);
            });

            it('get a flag active corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory.active).to.equals(true);
                expect(noteFactory._data['active']).to.equals(true);

                noteFactory.active = false;
                expect(noteFactory.active).to.equals(noteFactory._data['active']);
            });
        });


        describe('NoteFactory.tags deve', function () {
            it('setar as tags corretamente', function () {
                var noteFactory = new NoteFactory();
                expect(noteFactory.tags).to.exist;
                expect(noteFactory.tags).to.be.empty;

                noteFactory.tags.push('tag1');
                noteFactory.tags.push('tag2');
                noteFactory.tags.push('tag3');

                expect(noteFactory._data['tags']).to.exist;
                expect(noteFactory._data['tags']).to.not.be.empty;
                expect(noteFactory._data['tags']).to.have.length(3);
            });

            it('get as tags corretamente', function () {
                var noteFactory = new NoteFactory();
                noteFactory.tags.push('tag1');
                noteFactory.tags.push('tag2');
                noteFactory.tags.push('tag3');

                expect(noteFactory.tags).to.equals(noteFactory._data['tags']);
            });
        });


        describe('NoteFactory.scheduling deve', function () {
            it('setar o scheduling corretamente', function () {
                var noteFactory = new NoteFactory();
                assert.isNull(noteFactory.scheduling);

                var date = '1995/09/15';
                var hour = '09:30';
                var dateObj = new Date(date + ' ' + hour);

                noteFactory.scheduling = dateObj;

                assert.isNotNull(noteFactory.scheduling);
                assert.isNotNull(noteFactory._data['scheduling']);
                expect(noteFactory._data['scheduling']).to.be.equals(dateObj);
            });

            it('get o scheduling corretamente', function () {
                var noteFactory = new NoteFactory();

                var date = '1995/09/15';
                var hour = '09:30';
                var dateObj = new Date(date + ' ' + hour);

                noteFactory.scheduling = dateObj;

                var getScheduling = noteFactory.scheduling;

                expect(dateObj).to.be.equals(getScheduling);
                expect(noteFactory._data['scheduling']).to.be.equals(getScheduling);

            });
        });


        describe('del deve', function () {
            it('deletar corretamente uma nota', function () {
                self.$httpBackend.expectDELETE('/api/notes/1').respond({});
                var note = NoteMock.get();
                note._id = '1';
                var noteFactory = new NoteFactory(note);

                noteFactory.del();
                self.$httpBackend.flush();
            });

        });

        describe('save deve', function () {
            it('realizar um post para uma nota nova', function (done) {
                self.$httpBackend.expectPOST('/api/notes').respond({});
                var tempNote = NoteMock.get();
                tempNote._id = null;
                var note = new NoteFactory(tempNote);
                note.save().should.be.fulfilled.then().should.notify(done);
                self.$httpBackend.flush();
            });

            it('realizar um patch para uma nota já existente', function (done) {
                self.$httpBackend.expectPATCH('/api/notes/1').respond({});
                var tempNote = NoteMock.get();
                tempNote._id = '1';
                var note = new NoteFactory(tempNote);
                note.save().should.be.fulfilled.then().should.notify(done);
                self.$httpBackend.flush();
            });
        });

        describe('updateSchedulingColor deve', function () {
            var umaHora = 1000 * 60 * 60;
            var colors = {
                0: 'red',   // Done
                1: 'amber-800',         // < 12 hours
                2: 'green',  // > 12 hours
                4: ''                   // no scheduling
            };

            it('definir cor verde para nota com mais de 12 horas até seu agendamento', function () {
                var note = NoteMock.get();
                var trezeHoras = umaHora * 13;
                var daquiTrezeHoras = new Date();
                daquiTrezeHoras.setTime(daquiTrezeHoras.getTime() + trezeHoras);
                note.scheduling = daquiTrezeHoras;

                expect(note.schedulingColor).to.be.empty;
                note.updateSchedulingColor();

                expect(note.schedulingColor).to.be.equals(colors[2]);
            });

            it('definir cor amarela para nota com menos de 12 horas até seu agendamento', function () {
                var note = NoteMock.get();
                var trezeHoras = umaHora * 10;
                var daquiDezHoras = new Date();
                daquiDezHoras.setTime(daquiDezHoras.getTime() + trezeHoras);
                note.scheduling = daquiDezHoras;

                expect(note.schedulingColor).to.be.empty;
                note.updateSchedulingColor();

                expect(note.schedulingColor).to.be.equals(colors[1]);
            });

            it('definir cor vermelha para nota com agendamento expirado', function () {
                var note = NoteMock.get();
                var trezeHoras = umaHora * -1;
                var menosUmaHora = new Date();
                menosUmaHora.setTime(menosUmaHora.getTime() + trezeHoras);
                note.scheduling = menosUmaHora;

                expect(note.schedulingColor).to.be.empty;
                note.updateSchedulingColor();

                expect(note.schedulingColor).to.be.equals(colors[0]);
            });

            it('não definir cor para nota sem agendamento', function () {
                var note = NoteMock.get();

                expect(note.schedulingColor).to.be.empty;
                note.updateSchedulingColor();

                expect(note.schedulingColor).to.be.empty;
            });
        });
    })
} ());