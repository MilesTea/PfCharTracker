const baseFeatsTemplate = {
    1: ['heritage', 'ancestry'],
    2: ['class', 'skill'],
    3: ['general', 'increase'],
    4: ['class', 'skill'],
    5: ['increase', 'ancestry'],
    6: ['class', 'skill'],
    7: ['general', 'increase'],
    8: ['class', 'skill'],
    9: ['increase', 'ancestry'],
    10: ['class', 'skill'],
    11: ['general', 'increase'],
    12: ['class', 'skill'],
    13: ['increase', 'ancestry'],
    14: ['class', 'skill'],
    15: ['general', 'increase'],
    16: ['class', 'skill'],
    17: ['increase', 'ancestry'],
    18: ['class', 'skill'],
    19: ['general', 'increase'],
    20: ['class', 'skill'],
}

const translate = {
    class: 'классовая',
    skill: 'навыка',
    general: 'общая',
    ancestryfeat: 'родословной',
    heritage: 'наследия',
    ancestry: 'родословная',
    background: 'предыстория'
}


class AbilitiesWindow {
    constructor() {
        this.html = {}
        this.html.mainWindow = document.querySelector('#abilities-window')
        this.abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha']
        this.types = ['base', 'ancestry', 'background', 'class', 'free', 'total']
        this.typesObject = [{str: 'СИЛ'}, {dex: 'ЛОВ'}, {con: 'ТЕЛ'}, {int: 'ИНТ'}, {wis: 'МУД'}, {cha: 'ХАР'}]
        this.headers = ['Хар-ка', 'Базовая', 'Раса', 'Предыстория', 'Классовая', 'Повышение', 'Итого']
        this.freeAncestry = 0
        this.freeBackground = 0

        this.html.headers = document.querySelector('.abilities-headers')
        this.createHeaders(this.html.headers)

        this.createAbilities()
        this.setupAttributes()
    }

    setupAttributes() {
        // позволяет задавать значение стат на странице простой командой
        // abilities.dex.ancestry = 12
        // а также получать финальное значение статы командой
        // abilities.str.total
        this.status = {}
        this.abilities.forEach(ability => {
            this[ability] = {}
            this.status[ability] = {}
            this.types.forEach(type => {
                if(type=='base') {} 
                else if(type=='total') {
                    Object.defineProperty(this[ability], type, {
                        get: function() {
                            let total = Number(this.html[ability].base.textContent) + 
                            Number(this.html[ability].ancestry.textContent) + 
                            Number(this.html[ability].background.textContent) + 
                            Number(this.html[ability].class.textContent) + 
                            Number(this.html[ability].free.textContent)
                            this.html[ability].total.textContent = total
                            return total
                        }.bind(this),
                        set: function(value) {
                            if(typeof value != "string" && typeof value != 'number'){return undefined}
                            if(isNaN(value)){return undefined} 
                            this.html[ability].total.textContent = value
                        }.bind(this)
                    })
                } else {
                    this.status[ability][type] = false
                    Object.defineProperty(this[ability], type, {
                        get: function() {
                            return Number(this.html[ability][type].textContent)
                        }.bind(this),
                    
                        set: function(value) {
                            if(typeof value != "string" && typeof value != 'number'){return undefined}
                            if(isNaN(value)){return undefined} 
                            this.html[ability][type].textContent = value
                            this[ability].total = this[ability].total
                        }.bind(this)
                    });     
                }
             
                this[ability][type]
            })
        })
    }

    togleAbility(ability, type) {
        this.status[ability][type] = !this.status[ability][type]
        this.html[ability][type].classList.toggle('ability-active')
        this.updateStat(ability, type)
    }

    enableAbility(ability, type) {
        this.status[ability][type] = true
        this.html[ability][type].classList.add('ability-active')
        this.updateStat(ability, type)
    }

    disableAbility(ability, type) {
        this.status[ability][type] = false
        this.html[ability][type].classList.remove('ability-active')
        this.updateStat(ability, type)
    }

    clickScript(abilityId, typeId) {
        let ability = this.abilities[abilityId]
        let type = this.types[typeId]
        let activated = this.status[ability][type]
        let activatedAbilities = 0
        this.abilities.forEach(ability => {
            if(this.status[ability][type]) {activatedAbilities += 1}
        })
        if(activated){this.disableAbility(ability, type); return}
        switch(type) {
            case 'free':
                if (activatedAbilities >= 4){break} else {this.enableAbility(ability, type)}
                break
            case 'class':
                let classAbilities = this.getClass()
                if(classAbilities.includes(ability)){
                    if(activatedAbilities >= 1) {break} else {this.enableAbility(ability, type)}
                }
                break
            case 'ancestry':
                if(activatedAbilities >= this.freeAncestry){break} else {
                    if(this[ability][type]>0){break} 
                    this.enableAbility(ability, type);break}
            case 'background':
                if(activatedAbilities == this.freeBackground){
                    if(this.getBackground().fixed.includes(ability)){this.enableAbility(ability, type); break}
                    let alreadySet = 0
                    this.getBackground().fixed.every(_ability => {
                        if(this.status[_ability][type]){this.enableAbility(ability, type); return false}
                        return true
                    })
                    break
                } else if(activatedAbilities > this.freeBackground) {break} 
                else {this.enableAbility(ability, type)}
                break
        }
        




        // this.togleAbility(abi, n)
    }

    createHeaders(parentelement) {
        this.headers.forEach(headerText => {
            let header = document.createElement('div')
            header.textContent = headerText
            header.classList.add('abilities-header')
            parentelement.appendChild(header)
        })
    }

    createAbilities(parentelement) {
        let htmlFields = document.querySelectorAll('.abilities-stats')

        for(let i = 0; i<this.typesObject.length; i++) {
            let [statTechnicalName, statDisplayName] = Object.entries(this.typesObject[i])[0]
            let statNameField = document.createElement('div')
            statNameField.classList.add('abilities-stat-name')
            htmlFields[i].appendChild(statNameField)
            statNameField.textContent = statDisplayName

            this.html[statTechnicalName] = {}
            for(let n = 0; n<this.types.length; n++) {
                let statField = document.createElement('div')
                statField.classList.add('abilities-stat')
                htmlFields[i].appendChild(statField)
                statField.addEventListener('click', () => {
                    this.clickScript(i, n)
                    // console.log(this.types[n], Object.keys(this.typesObject[i])[0])
                })
                statField.textContent = n==0? 10 : 0
                this.html[statTechnicalName][this.types[n]] = statField
            }
            
        }
    }

    updateStat(ability, type) {
        let statValue = 0
        if(character.ancestry.current.id && type=='ancestry') {statValue = character.ancestry.current.abilities[ability]}
        statValue += this.status[ability][type] ? 2 : 0
        // switch(type) {
        //     case 'free':
        //         statValue = this.status[ability].free ? 2 : 0
        //         break
        // }
        this[ability][type] = statValue

    }   
    
    getRacial() {
        if(character.ancestry.current.id){
            return character.ancestry.current.abilities
        } else {
            return 0
        }
    }

    getClass() {
        if(character.class.current.id){
            return character.class.current.abilities
        } else {return []}
    }

    getBackground() {
        if(character.background.current.id){
            return character.background.current.abilities
        } else {return []}
    }

    reset() {
        if(character.ancestry.current.id){
            let abilities = character.ancestry.current.abilities
            this.freeAncestry = abilities.free
            this.abilities.forEach(ability => {
                
                this[ability].ancestry = abilities[ability] + this.status[ability].ancestry ? 2 : 0})
        } else {
            this.freeAncestry = 0
            this.abilities.forEach(ability => {
                this.disableAbility(ability, 'ancestry')
                this[ability].ancestry = 0})
        }

        if(character.background.current.id){
            let abilities = character.background.current.abilities
            this.freeBackground = abilities.free
            this.abilities.forEach(ability => {
                this[ability].background = abilities[ability] + this.status[ability].background ? 2 : 0})
        } else {
            this.freeBackground = 0
            this.abilities.forEach(ability => {
                this.disableAbility(ability, 'background')
                this[ability].background = 0})
        }


        // if(character.class.current.id){
        //     let
        // }
    }

    getDefault() {}
}







class FeatTypes {
    constructor() {
        this.types = {}
        let response = fetch('api/feattypes/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {return response.json()})
        .then((data) => {
            data.forEach(type => {this.types[type.id] = type.name})
        })
        
    }
    getById(id) {
        return this.types[id]
    }
    getByName(name) {
        return Object.keys(this.types).find(key => this.types[key] === name)
    }
}

class Skills {
    constructor(parentelement) {
        this.html = {}
        this.html.headers = {}
        this.html.headers.mainWindow = document.createElement('div')
        this.html.headers.mainWindow.classList.add('skill-row')
        parentelement.appendChild(this.html.headers.mainWindow)

        this.html.headers.name = document.createElement('div')
        this.html.headers.name.classList.add('skill-field')
        this.html.headers.name.classList.add('skill-name')
        this.html.headers.name.textContent = 'Навыки'
        this.html.headers.mainWindow.appendChild(this.html.headers.name)

        this.html.headers.total = document.createElement('div')
        this.html.headers.total.classList.add('skill-field')
        this.html.headers.total.classList.add('skill-total')
        this.html.headers.mainWindow.appendChild(this.html.headers.total)

        this.html.headers.proficiency = document.createElement('div')
        this.html.headers.proficiency.classList.add('skill-field')
        this.html.headers.proficiency.classList.add('skill-proficiency')
        this.html.headers.mainWindow.appendChild(this.html.headers.proficiency);

        this.html.headers.proficiencyRow = document.createElement('div')
        this.html.headers.proficiencyRow.classList.add('skill-proficiency-row')
        this.html.headers.proficiency.appendChild(this.html.headers.proficiencyRow);

        ['Т', 'Э', 'М', 'Л'].forEach(prof => {
            let profField = document.createElement('div')
            profField.classList.add('skill-proficiency-type')
            console.log(this.html.headers.proficiency)
            this.html.headers.proficiencyRow.appendChild(profField)
            profField.textContent = prof
        });


        this.html.skills = {};
        [
            ['acrobatics', 'Акробатика'], 
            ['arcane', 'Аркана'], 
            ['athletics', 'Атлетика'], 
            ['crafting', 'Ремесло'], 
            ['deception', 'Обман'], 
            ['diplomacy', 'Дипломатия'], 
            ['intimidation', 'Запугивание'], 
            ['medicine', 'Медицина'], 
            ['nature', 'Природа'], 
            ['occultism', 'Оккультизм'], 
            ['performance', 'Выступление'], 
            ['religion', 'Религия'], 
            ['society', 'Общество'], 
            ['stealth', 'Скрытность'], 
            ['survival', 'Выживание'], 
            ['thievery', 'Воровство'], 
        ].forEach(skill => {
            this.html.skills[skill[0]] = {}
            this.html.skills[skill[0]].mainWindow = document.createElement('div')
            this.html.skills[skill[0]].mainWindow.classList.add('skill-row')
            parentelement.appendChild(this.html.skills[skill[0]].mainWindow)

            this.html.skills[skill[0]].name = document.createElement('div')
            this.html.skills[skill[0]].name.classList.add('skill-field')
            this.html.skills[skill[0]].name.classList.add('skill-name')
            this.html.skills[skill[0]].name.textContent = skill[1]
            this.html.skills[skill[0]].mainWindow.appendChild(this.html.skills[skill[0]].name)

            this.html.skills[skill[0]].total = document.createElement('div')
            this.html.skills[skill[0]].total.classList.add('skill-field')
            this.html.skills[skill[0]].total.classList.add('skill-total')
            this.html.skills[skill[0]].mainWindow.appendChild(this.html.skills[skill[0]].total)

            this.html.skills[skill[0]].proficiencyMain = document.createElement('div')
            this.html.skills[skill[0]].proficiencyMain.classList.add('skill-field')
            this.html.skills[skill[0]].proficiencyMain.classList.add('skill-proficiency')
            this.html.skills[skill[0]].mainWindow.appendChild(this.html.skills[skill[0]].proficiencyMain)

            this.html.skills[skill[0]].proficiencyRow = document.createElement('div')
            this.html.skills[skill[0]].proficiencyRow.classList.add('skill-proficiency-row')
            this.html.skills[skill[0]].proficiencyMain.appendChild(this.html.skills[skill[0]].proficiencyRow)

            this.html.skills[skill[0]].proficiency = {}
            for(let i = 0; i < 4; i++) {
                this.html.skills[skill[0]].proficiency[i] = document.createElement('div')
                this.html.skills[skill[0]].proficiency[i].classList.add('skill-proficiency-box')
                this.html.skills[skill[0]].proficiencyRow.appendChild(this.html.skills[skill[0]].proficiency[i])
            }

            this.html.skills[skill[0]].ability = document.createElement('div')
            this.html.skills[skill[0]].item = document.createElement('div')

        })
    }


        setupAttributes() {
        // позволяет задавать значение стат на странице простой командой
        // abilities.dex.ancestry = 12
        // а также получать финальное значение статы командой
        // abilities.str.total
        // this.proficiencies = {}
        // for(let skill in this.skills)


        // this.abilities.forEach(ability => {
        //     this[ability] = {}
        //     this.status[ability] = {}
        //     this.types.forEach(type => {
        //         if(type=='base') {} 
        //         else if(type=='total') {
        //             Object.defineProperty(this[ability], type, {
        //                 get: function() {
        //                     let total = Number(this.html[ability].base.textContent) + 
        //                     Number(this.html[ability].ancestry.textContent) + 
        //                     Number(this.html[ability].background.textContent) + 
        //                     Number(this.html[ability].class.textContent) + 
        //                     Number(this.html[ability].free.textContent)
        //                     this.html[ability].total.textContent = total
        //                     return total
        //                 }.bind(this),
        //                 set: function(value) {
        //                     if(typeof value != "string" && typeof value != 'number'){return undefined}
        //                     if(isNaN(value)){return undefined} 
        //                     this.html[ability].total.textContent = value
        //                 }.bind(this)
        //             })
        //         } else {
        //             this.status[ability][type] = false
        //             Object.defineProperty(this[ability], type, {
        //                 get: function() {
        //                     return Number(this.html[ability][type].textContent)
        //                 }.bind(this),
                    
        //                 set: function(value) {
        //                     if(typeof value != "string" && typeof value != 'number'){return undefined}
        //                     if(isNaN(value)){return undefined} 
        //                     this.html[ability][type].textContent = value
        //                     this[ability].total = this[ability].total
        //                 }.bind(this)
        //             });     
        //         }
             
        //         this[ability][type]
        //     })
        // })
    }
}

let featTypes = new FeatTypes

class ChoiceWindow {
    constructor(type, url, message, choiceText, level=undefined) {
        this.type = type
        this.url = url
        this.message = message
        this.choiceText = choiceText


        this.current = {}
        this.selectedOption = {}
        this.onChange = []

        this.html = {}

        this.level = level
        this.html.mainField = document.createElement("div")
        this.html.mainField.classList.add('selection')
        this.html.currentField = document.createElement('div')
        this.html.currentNameField = document.createElement('div')
        this.html.currentNameField.classList.add('selection-current-name')
        this.html.currentAdditionalFields = document.createElement('div')
        this.html.currentDescriptionField = document.createElement('div')
        this.html.currentDescriptionField.classList.add('selection-current-description')
        this.html.currentNameField.textContent = this.message 
        this.html.currentField.appendChild(this.html.currentNameField)
        this.html.currentAdditionalFields.appendChild(this.html.currentDescriptionField)
        this.html.currentField.appendChild(this.html.currentDescriptionField)
        



        this.html.currentField.addEventListener('click', async () => {
            let feats = await this.getChoices()
            this.addOptions(feats)
        })



        this.featTypeName = document.createElement("div")
        this.featTypeName.textContent = this.choiceText

        this.html.mainField.appendChild(this.featTypeName)
        this.html.mainField.appendChild(this.html.currentField)
    }
    
    removeOptions() {
        this.selectedOption = {}
        this.html.blocker.remove()
    }

    reset() {
        this.html.currentNameField.textContent = this.message
        this.html.currentDescriptionField.textContent = ''
        this.current = {}
        this.removeOptions()
    }

    valueChanged() {
        this.onChange.forEach(func => func())
    }

    addOptions(feats) {
        this.html.blocker = document.createElement('div')
        this.html.blocker.classList.add('blocker')
        this.html.blocker.addEventListener('click', () => {this.removeOptions()})
        document.querySelector('body').appendChild(this.html.blocker)

        this.html.blockerWindow = document.createElement('div')
        this.html.blockerWindow.classList.add('blocker-window')
        this.html.blockerWindow.classList.add('theme')
        this.html.blockerWindow.addEventListener('click', event => event.stopPropagation())
        this.html.blocker.appendChild(this.html.blockerWindow)

        this.html.selectionsWindow = document.createElement('div')
        this.html.selectionsWindow.classList.add('selections-window')
        this.html.blockerWindow.appendChild(this.html.selectionsWindow)

        this.html.optionsWindow = document.createElement('div')
        this.html.optionsWindow.classList.add('options-window')
        this.html.selectionsWindow.appendChild(this.html.optionsWindow)

        this.html.descriptionWindow = document.createElement('div')
        this.html.descriptionWindow.classList.add('descriptions-window')
        this.html.selectionsWindow.appendChild(this.html.descriptionWindow)

        this.html.confirmButton = document.createElement('div')
        this.html.confirmButton.classList.add('confirm-button')
        this.html.confirmButton.textContent = 'Выбрать'
        this.html.confirmButton.addEventListener('click', () => {
            if(Object.keys(this.selectedOption).length != 0) {
                this.html.currentNameField.textContent = this.selectedOption.name
                this.html.currentDescriptionField.textContent = this.selectedOption.description
                this.current = this.selectedOption
                this.removeOptions()
            } else {
                this.reset()
            }
            this.valueChanged()
        })
        this.html.blockerWindow.appendChild(this.html.confirmButton)

        this.addBlankOption(this.html.optionsWindow)
        feats.forEach(feat => {
            this.addOption(this.html.optionsWindow, feat)
        });
    }

    addBlankOption(element) {
        let option = document.createElement('div')
        option.classList.add('selection-option')
        option.textContent = '---'
        element.appendChild(option)
        option.addEventListener('click', () => {
            this.selectedOption = {}
            this.html.descriptionWindow.textContent = ''
        })
    }

    addOption(element, feat) {
        let option = document.createElement('div')
        option.classList.add('selection-option')
        option.textContent = feat.name
        element.appendChild(option)
        option.addEventListener('click', () => {
            this.selectedOption = feat
            this.html.descriptionWindow.textContent = feat.description
        })
    }

    async getChoices() {
        let params = {}
        params.sources = `${this.includeBaseSource ? 'none,' : ''}${character.getSources()}`
        params.type = featTypes.getByName(this.type)
        if(this.level){params.level_max = this.level}
        if(character.getCurrentFeatIds(this.level).toString()) {
            params.exclude_ids = character.getCurrentFeatIds(this.level).toString()
        }
        console.log(params)
        return await getChoices(this.url, params)
    }

}


class ClassFeatWindow extends ChoiceWindow {
    constructor(level) {
        super('class', 'api/feats/', 'Выберите черту', `Черта ${translate['class']}`, level)

    }
}

class SkillFeatWindow extends ChoiceWindow {
    constructor(level) {
        super('skill', 'api/feats/', 'Выберите черту', `Черта ${translate['skill']}`, level)
    }
}

class AncestryFeatWindow extends ChoiceWindow {
    constructor(level) {
        super('ancestry', 'api/feats/', 'Выберите черту', `Черта ${translate['ancestry']}`, level)
    }
}

class GeneralFeatWindow extends ChoiceWindow {
    constructor(level) {
        super('general', 'api/feats/', 'Выберите черту', `Черта ${translate['general']}`, level)
    }
}

class AncestryWindow extends ChoiceWindow {
    constructor() {
        super('', 'api/ancestries/', 'Выберите родословную', `Ваша ${translate['ancestry']}`)
    }

    async getChoices() {
        return await getChoices(this.url)
    }
}

class ClassWindow extends ChoiceWindow {
    constructor() {
        super('', 'api/classes/', 'Выберите класс', `Ваш класс`)
    }

    async getChoices() {
        return await getChoices(this.url)
    }
}

class HeritageWindow extends ChoiceWindow {
    constructor() {
        super('', 'api/heritages/', 'Выберите наследие', `Вашe ${translate['heritage']}`)
    }

    async getChoices() {
        let params = {}
        if(character.ancestry.current.type){params.source = character.ancestry.current.type} else return []
        return await getChoices(this.url, params)
    }
}

class BackgroundWindow extends ChoiceWindow {
    constructor() {
        super('', 'api/backgrounds/', 'Выберите предысторию', `Ваша ${translate['background']}`)
    }

    async getChoices() {
        return await getChoices(this.url)
    }
}


class Character{
    constructor(parentelement) {
        this.abilities = new AbilitiesWindow()
        this.feats = {}
        this.featsField = document.createElement("div")

        this.class = new ClassWindow()
        parentelement.appendChild(this.class.html.mainField)
        let classOnChangeFunction = function() {
            this.deleteFeatsFields()
            if(!this.class.current.id) {return}
            this.createFeatsFields()
            this.abilities.reset()
        }

        this.class.onChange.push(classOnChangeFunction.bind(this))


        this.background = new BackgroundWindow()
        this.background.onChange.push(() => {this.abilities.reset()})
        parentelement.appendChild(this.background.html.mainField)


        this.ancestry = new AncestryWindow()
        this.ancestry.onChange.push(() => {this.abilities.reset()})
        parentelement.appendChild(this.ancestry.html.mainField)


        this.heritage = new HeritageWindow()
        parentelement.appendChild(this.heritage.html.mainField)


        parentelement.appendChild(this.featsField)


    }
    async createFeatsFields() {

        

        for(const [level, featslist] of Object.entries(baseFeatsTemplate)) {

            let levelField = document.createElement('div')
            let levelFieldText = document.createElement('p')
            levelFieldText.textContent = `${level} уровень`
            levelField.appendChild(levelFieldText)
            this.featsField.appendChild(levelField)
            this.feats[level] = {}
            featslist.forEach(feat => {
                if(!(feat=='heritage' | feat=='increase')){
                    let featField = new choiceToWindowClass[`${feat}`](level)
                    if(!this.feats[level][feat]) {this.feats[level][feat] = []}
                    this.feats[level][feat].push(featField)
                    levelField.appendChild(featField.html.mainField)
                }
            });

        }

    


    }
    getSources(level) {
        
        let sources = this.class.current.id
        if(this.ancestry.current.id){sources = sources + ',' + this.ancestry.current.type}
        return sources
    }

    getCurrentFeatIds(level) {
        let currentIds = []
        for(let i=1; i < Number(level)+1; i++){
            if(this.feats[i]) {
                for(let feats in this.feats[i]) {
                    this.feats[i][feats].forEach(feat => {
                        if(feat.id) {currentIds.push(feat.id)}
                    })
                }
            }
        }
        console.log(currentIds)
        return currentIds
    }

    deleteFeatsFields() {
        this.featsField.innerHTML = ''
    }

    getCharacterContext(level) {
        return {sources: this.class}
    }
}

async function getChoices(url, params=null) {
    if(params) {
        let urlParams = new URLSearchParams(params)
        url = url + '?' + urlParams
    }
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    let data = await response.json()
    return data
}


const choiceToWindowClass = {
    class: ClassFeatWindow,
    skill: SkillFeatWindow,
    general: GeneralFeatWindow,
    ancestry: AncestryFeatWindow
}

const featsField = document.getElementById('feats-field')
const character = new Character(featsField)

let currentWindow = 0

let menuIds = ['main', 'skills', 'inventory']
let menu = {}

menuIds.forEach(menuId => {
    menu[menuId] = {}
    menu[menuId].window = document.getElementById(`window-${menuId}`)
    menu[menuId].menu = document.getElementById(`menu-${menuId}`)

    menu[menuId].menu.addEventListener('click',() => {
        for(let menuEntry in menu) {
            if(menuEntry!=menuId) {
                menu[menuEntry].menu.classList.remove('header-active')
                menu[menuEntry].window.classList.add('window-hidden')}
            else {
                menu[menuEntry].menu.classList.add('header-active')
                menu[menuEntry].window.classList.remove('window-hidden')}
        }
    })
})

let skills = new Skills(document.getElementById('window-skills'))