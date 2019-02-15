function Tasks(initial) {
    this.list = (initial || [])

    // Task storage add
    this.add = function(name){
        const t = new Task(name, false);
        this.list.push(t);
        this.events['add'](t);
    }

    this.events = {};
    this.on = function(eventaName, cb){
        this.events[eventaName] = cb;
    }

    this.count = function() {
        return this.list.length;
    }

    this.save = function() {
        localStorage.setItem('_tasks', JSON.stringify(this.list));
    }
    this.get = function(){
        JSON.parse(localStorage.getItem("_tasks"));
    }
}

function Task(name, completed) {
    this.name = name;
    this.completed = completed;
}

const storage = new Tasks([]);

storage.on('add', function(t){
    // Html append

});

storage.add('asdasdasd');

