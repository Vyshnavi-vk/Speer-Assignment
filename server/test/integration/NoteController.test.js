import app from '../../server.js';
import supertest from 'supertest';
import chaiHttp from 'chai-http';
import * as chai from 'chai';

const request = supertest(app);
const { expect } = chai
chai.use(chaiHttp);


describe('Integration Test for Note Routes', () => {
    let authToken;
    var noteId;
    let createNoteResponse;
    let userId
    let existingUserId

    it('should successfully log in a user and return a token', async () => {
        const testUser = {
            name: 'Jake',
            email: 'jake@example.com',
            password: 'password123',
        };

        const signupResponse = await request
            .post('/api/auth/signup')
            .send(testUser);


        const loginResponse = await request
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        userId = loginResponse.body._id
        console.log(userId);


        const newUser = {
            name: 'peter',
            email: 'peterexample.com',
            password: 'password456',
        };


        // const createUserResponse = await request.post('/api/auth/signup').send(newUser);
        // existingUserId = createUserResponse.body.id;

        const createLogin = await request
            .post('/api/auth/login')
            .send({
                email: newUser.email,
                password: newUser.password,
            });

        authToken = `Bearer ${loginResponse.body.token}`;
    })


    //create note
    it('should successfully create a new note', async () => {
        const newNote = {
            title: 'Test Note',
            content: 'This is a test note content.',
        };

        createNoteResponse = await request
            .post('/api/notes')
            .set('Authorization', authToken)
            .send(newNote);

        expect(createNoteResponse.body).to.have.property('_id');
        expect(createNoteResponse.body).to.have.property('title', newNote.title);
        expect(createNoteResponse.body).to.have.property('content', newNote.content);

        const noteId = createNoteResponse.body._id;
    });


    //fetchNotes
    it('should successfully fetch all notes for the authenticated user', async () => {
        const fetchNotesResponse = await request
            .get('/api/notes')
            .set('Authorization', authToken);

        expect(fetchNotesResponse.body).to.be.an('array');
    })

    // getNoteById
    it('should successfully fetch a single note by its ID for the authenticated user', async () => {
        noteId = createNoteResponse.body._id
        const getNoteByIdResponse = await request
            .get(`/api/notes/${noteId}`)
            .set('Authorization', authToken);


        expect(getNoteByIdResponse.body).to.have.property('_id', noteId);
        expect(getNoteByIdResponse.body).to.have.property('title', 'Test Note');
        expect(getNoteByIdResponse.body).to.have.property('content', 'This is a test note content.');
    });


    //update note
    it('should successfully update a note by its ID for the authenticated user', async () => {
        const updatedTitle = 'Updated Test Note';
        const updatedContent = 'This is the updated content.';
        noteId = createNoteResponse.body._id;

        const updateNoteResponse = await request
            .put(`/api/notes/${noteId}`)
            .set('Authorization', authToken)
            .send({
                title: updatedTitle,
                content: updatedContent,
            });

        expect(updateNoteResponse.body).to.have.property('_id', noteId);
        expect(updateNoteResponse.body).to.have.property('title', updatedTitle);
        expect(updateNoteResponse.body).to.have.property('content', updatedContent);

    });



    //delete note
    it('Should successfully delete a note by its ID for the authenticated user', async () => {
        noteId = createNoteResponse.body._id


        const deleteNoteResponse = await request
            .delete(`/api/notes/${noteId}`)
            .set('Authorization', authToken);

        expect(deleteNoteResponse).to.have.property('text', 'Note deleted successfully');
    })


    //share note
    it('should successfully share a note with an existing user', async () => {
        const shareNoteResponse = await request
            .post(`/api/notes/${noteId}/share`)
            .set('Authorization', authToken)
            .send({
                toUserId: existingUserId,
            });

        // expect(shareNoteResponse.body).to.have.property('msg', 'Note shared');

    });



    //search query
    it('should search notes based on the provided query', async () => {

        const fakeNotes = [
            { _id: 'note123', title: 'Note 1', content: 'Lorem Ipsum', owner: 'user_id' },
            { _id: 'note456', title: 'Note 2', content: 'Dolor Sit', owner: 'user_id' },
        ];


        const searchResponse = await request
            .get(`/api/notes/search?q=${encodeURIComponent('Lorem')}`)
            .set('Authorization', authToken);

        // expect(searchResponse.body).to.have.property('msg').to.be.an('array');

    });


});




