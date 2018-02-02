import insert from './insert'
import { replaceTableId, replaceStructure } from './insert'
import range from './lib/range'

var knexStub = async (data, table, id) => { 
    return range(data.length)
}

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
        replaceTableId(l, ['location|2', 'location|1'], [1, 2])
              
        expect(l).deep.eql([
            { id: 2, lat: 32.1 },
            { id: 1, lat: 32.2 }
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


    it('replaceStructure speed', function () {
        var records = range(1000);
        var fields = range(40);
        var batch = range(50);

        var l = {
            project: records.map(function(i) {
                var r = {}
                fields.forEach(fi => {
                    var v = `rec${i}_fld${fi}`;
                    r[v] = v
                })
                return r;
            }),
        } 
        
        var t0 = new Date();
        replaceStructure(l, batch.map(b => 'project:' + b), batch.map(b => b))
        var t1 = new Date();

        console.log("replaceStructure took " + (t1 - t0) + "ms.")
    })


    it('insert', async function () {
        var l = {
            project: [
                { id:'project:1', description: 'text1' },
                { id:'project:2', description: 'text2' } 
            ],
            location: [ 
                { id: 'location:1', lat: 32.1, projectId:'project:2' },
                { id: 'location:2', lat: 32.2, projectId:'project:1' } 
            ],
            permit: [
                { id:'permit:1', description: 'permit1', projectId:'project:2' },
                { id:'permit:2', description: 'permit2', projectId:'project:1' }
            ]
        }

        var insertFun = async (data, table, id) => { 
            return range(data.length)
        }
        var res = await insert(insertFun, l, {
            project:'id', 
            location: 'id', 
            permit: 'id'
        })
        
        //console.log(res)
        //console.log('res',l)
        //console.log(JSON.stringify(l))
        expect(res).deep.eql({
            project: [
                { id:1, description: 'text1' },
                { id:2, description: 'text2' } 
            ],
            location: [ 
                { id: 1, lat: 32.1, projectId:2 },
                { id: 2, lat: 32.2, projectId:1 } 
            ],
            permit: [
                { id:1, description: 'permit1', projectId:2 },
                { id:2, description: 'permit2', projectId:1 } 
            ]
        })
    })

    it('insert batch', async function () {
        var cnt = 0;
        var data = {
            project: [
                { id:'project:1', description: 'text1' },
                { id:'project:2', description: 'text2' },
                { id:'project:3', description: 'text3' },
                { id:'project:4', description: 'text4' },
                { id:'project:5', description: 'text5' },
                { id:'project:6', description: 'text6' },
                { id:'project:7', description: 'text7' }
            ]
        }

        var insertFun = async (data, table, id) => { 
            cnt++
            return range(data.length)
        }
        var res = await insert(
            insertFun, 
            data, 
            {
                project: 'id'
            },
            {
                batch: 3
            }
        )

        expect(cnt).equal(3);
    })    
})