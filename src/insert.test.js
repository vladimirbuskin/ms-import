import insert from './insert'
import { replaceTableId, replaceStructure } from './insert'
import range from './lib/range'

var knexStub = ({
    insert: (d) => ({
        returning: () => range(d.length)
    })
})

describe('insert', function () {

    it('required params', async function () {

        var ex = null;
        await insert(knexStub, {}, {});
        try {
            await insert(knexStub, {});
        } catch (e) {
            ex = e;
        }
        expect(ex).not.null;
    })

    it('meta check length', async function () {
        var ex = null;

        var l = {
            project: [
                { id:'project:1', description: 'text1' },
                { id:'project:2', description: 'text2' } 
            ],
            location: [ 
                { id: 'location|1', lat: 32.1, projectId:'project:1' },
                { id: 'location|2', lat: 32.2, projectId:'project:2' } 
            ]
        }
        var r = await insert(knexStub, l, {project:'id', location:'id'});
    })

    it('meta check length', async function () {
        var ex = null;
        await insert(knexStub, {project:[{id:1, desc:'asdf'}]}, {project:'id'});
        
        try {
            await insert(knexStub, {project:[{id:1, desc:'asdf'}]}, {project:'id', location:'id'});
        } catch (e) {
            ex = e;
        }
        expect(ex).not.null;        
    })    

    it('replaceTableId', function () {
        var l = [ { id: 'location|1', lat: 32.1 },
                  { id: 'location|2', lat: 32.2 } ]
        replaceTableId(l, ['location|1', 'location|2'], [1, 2])
              
        expect(l).deep.eql([
            { id: 1, lat: 32.1 },
            { id: 2, lat: 32.2 }
        ])
    })
    
    it('replaceStructure', function () {
        var l = {
            project: [
                { id:'project:1', description: 'text1' },
                { id:'project:2', description: 'text2' } 
            ],
            location: [ 
                { id: 'location|1', lat: 32.1, projectId:'project:1' },
                { id: 'location|2', lat: 32.2, projectId:'project:2' } 
            ]
        }
        replaceStructure(l, ['project:1', 'project:2'], [1, 2])
              
        expect(l).deep.eql({
            project: [
                { id:1, description: 'text1' },
                { id:2, description: 'text2' } 
            ],
            location: [ 
                { id: 'location|1', lat: 32.1, projectId:1 },
                { id: 'location|2', lat: 32.2, projectId:2 } 
            ]
        })
    })

    it('insert', async function () {
        var l = {
            project: [
                { id:'project:1', description: 'text1' },
                { id:'project:2', description: 'text2' } 
            ],
            location: [ 
                { id: 'location:1', lat: 32.1, projectId:'project:1' },
                { id: 'location:2', lat: 32.2, projectId:'project:2' } 
            ]
        }
        var res = await insert(knexStub, l, {project:'id', location: 'id'})
        
        //console.log(res)
        //console.log('res',l)
        //console.log(JSON.stringify(l))
        expect(res).deep.eql({
            project: [
                { id:1, description: 'text1' },
                { id:2, description: 'text2' } 
            ],
            location: [ 
                { id: 1, lat: 32.1, projectId:1 },
                { id: 2, lat: 32.2, projectId:2 } 
            ]
        })
    })

    // it.only('insert', async function () {
    //     var a = {
    //         project: {},
    //         location: {},
    //         permit: {}
    //     }
    //     var b = {
    //         location: {},
    //         permit: {},
    //         project: {}
    //     }
    //     console.log(Object.keys(a));
    //     console.log(Object.keys(b));
    // })    
})